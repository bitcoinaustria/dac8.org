# Renders the rules chapter of the history film as a panopticon at night:
# a ring of eight cells with barred windows onto a courtyard, a watchtower
# in the middle. One base picture, and for each cell a light pass with only
# a red searchlight from the tower through its window and a glow inside,
# on black, so the page can add each cell's light by screen blending as
# the years run. Nine separate watch passes light the observation windows
# for the next chapter. Add them cumulatively: 0..2, then 0..7, then 0..8.
# The script writes cell labels, marks, the tower top and window centres
# as percentages of the picture, keeping every pass on the same camera.
# The same world carries the film's later acts, each a still and a flight
# to it, rendered with every light on and a perspective camera:
#   wide     the EU's 27 account registers as 27 panopticons, with passes
#            for the links between them and the data riding on payments
#   cell     the view from inside the crypto cell through the bars
#   leak     a breach in the tower and one sheet per documented data leak
#   letter   a notice on the cell's table, its reason blacked out
#   yard     pallets of 100-euro notes at true scale: what three reporting
#            duties cost a year, the benefit measured and the benefit modelled
#   horn     the loudspeakers on the tower, for what was promised
#   proposal a pass in the overview's camera: a row of windows not yet open
# flight1..6 render the camera's way from one still to the next as frames;
# the first starts in the overview's own framing, so the film can cut from
# the layered picture to the flight without a jump.
# Usage: blender -b -P scripts/artwork/render-panopticon.py -- <outdir> [pass]
#   pass: "base", "light0".."light7", "watch0".."watch8", "points",
#         "proposal", "wide", "wide-links", "wide-tags", "cell", "leak",
#         "letter-de", "letter-en", "yard-cost", "yard-benefit", "horn",
#         "flight1".."flight6", "world" (label points of the stills), or
#         all (the overview's passes only).
# Outputs PNGs; export to panopticon-{base,light-0..7,watch-0..8}.webp at
# quality 82, without resizing, the stills to world-*.webp likewise and
# the flights' frames to public/film/flight<n>/<frame>.webp at quality 60.
# SAMPLES/PCT lower the cost of previews; DEVICE=GPU renders on OptiX;
# FRAMES and STEP pick a flight's frame count and every n-th frame.
# Before encoding light/watch passes, subtract 1/255 from RGB so render
# dithering cannot lift black when the page screen-blends many passes.
# Add -noaudio to the Blender command on machines without an audio server.
import json
import math
import os
import random
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1 :]
OUT = args[0]
ONLY = args[1] if len(args) > 1 else None
if ONLY == "all":
    ONLY = None
OVERVIEW = ("base", "points", *[f"light{k}" for k in range(8)], *[f"watch{k}" for k in range(9)])
WORLD = (
    "proposal", "wide", "wide-links", "wide-tags", "cell", "leak", "letter-de", "letter-en",
    "yard-cost", "yard-benefit", "horn", "world", *[f"flight{k}" for k in range(1, 7)],
)
if ONLY is not None and ONLY not in (*OVERVIEW, *WORLD):
    raise ValueError(f"Unknown panopticon pass: {ONLY}")
DEVICE = os.environ.get("DEVICE", "CPU")
SAMPLES = int(os.environ.get("SAMPLES", 160))
PCT = int(os.environ.get("PCT", 100))
W, H = 1600, 1440

# The cells, clockwise from the upper right, as the page lists the ways.
CELLS = 8
ANGLES = [math.radians(67.5 - k * 45) for k in range(CELLS)]
R_TOWER, R_IN, R_OUT = 1.7, 7.0, 10.0
WALL_H = 3.0
# A wider lantern puts nine full-height panes on the camera-facing arc.
# The first three are spaced across it, so every cumulative set balances.
R_LANTERN = 2.65
WATCH_SLOTS = [1, 4, 7, 0, 8, 2, 6, 3, 5]
WATCH_ANGLES = [math.radians(-146 + slot * 14) for slot in WATCH_SLOTS]
WATCH_Z = 5.48
HORN_Z = 8.35
HORN_ANGLES = [math.radians(a) for a in (0, 180)]
# Marks sit along the searchlight's path, from near the tower to the
# window, so none hides behind the tower.
MARK_T = [0.2 + k * 0.14 for k in range(6)]


def polar(a, r, z=0.0):
    return Vector((math.cos(a) * r, math.sin(a) * r, z))


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    if DEVICE == "GPU":
        prefs = bpy.context.preferences.addons["cycles"].preferences
        prefs.compute_device_type = "OPTIX"
        prefs.get_devices()
        for device in prefs.devices:
            device.use = device.type == "OPTIX"
        scene.cycles.device = "GPU"
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = True
    scene.render.resolution_x = W
    scene.render.resolution_y = H
    scene.render.resolution_percentage = PCT
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Punchy"
    return scene


def material(name, color, rough=0.8, metal=0.0, emit=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    if emit:
        bsdf.inputs["Emission Color"].default_value = (*emit, 1)
        bsdf.inputs["Emission Strength"].default_value = strength
    return mat


def concrete(name, color):
    # Concrete with a little unevenness, so walls do not look like plastic.
    mat = material(name, color, 0.9)
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 6.0
    noise.inputs["Detail"].default_value = 8.0
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*[c * 0.82 for c in color], 1)
    ramp.color_ramp.elements[1].color = (*color, 1)
    nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.15
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def ring(name, r0, r1, z0, z1, mat, segments=256):
    bpy.ops.mesh.primitive_cylinder_add(vertices=segments, radius=r1, depth=z1 - z0, location=(0, 0, (z0 + z1) / 2))
    outer = bpy.context.active_object
    outer.name = name
    bpy.ops.mesh.primitive_cylinder_add(vertices=segments, radius=r0, depth=(z1 - z0) + 1, location=(0, 0, (z0 + z1) / 2))
    hole = bpy.context.active_object
    mod = outer.modifiers.new("hole", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = hole
    hole.hide_render = True
    hole.hide_viewport = True
    outer.data.materials.append(mat)
    return outer


def box(name, size, at, rot_z, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=at)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    obj.rotation_euler[2] = rot_z
    if mat:
        obj.data.materials.append(mat)
    return obj


def build(scene):
    wall = concrete("wall", (0.62, 0.61, 0.58))
    floor = concrete("floor", (0.32, 0.31, 0.3))
    yard = concrete("yard", (0.2, 0.2, 0.21))
    ground = material("ground", (0.035, 0.038, 0.045), 0.95)
    steel = material("steel", (0.08, 0.08, 0.09), 0.35, 0.9)
    cot = material("cot", (0.25, 0.24, 0.23), 0.8)

    bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, 0))
    bpy.context.active_object.data.materials.append(ground)
    ring("yard", R_TOWER, R_IN, 0.0, 0.04, yard)
    ring("cellfloor", R_IN, R_OUT, 0.0, 0.08, floor)
    ring("outer", R_OUT, R_OUT + 0.45, 0.0, WALL_H, wall)
    inner = ring("inner", R_IN - 0.22, R_IN, 0.0, WALL_H, wall)

    # A window in each cell's inner wall, with bars; walls between cells.
    for k, a in enumerate(ANGLES):
        cut = box(f"cut{k}", (0.8, 1.9, 1.9), polar(a, R_IN - 0.1, 1.55), a, None)
        mod = inner.modifiers.new(f"win{k}", "BOOLEAN")
        mod.operation = "DIFFERENCE"
        mod.object = cut
        cut.hide_render = True
        cut.hide_viewport = True
        tangent = Vector((-math.sin(a), math.cos(a), 0))
        for b in range(7):
            off = (b - 3) * 0.26
            p = polar(a, R_IN - 0.11, 1.55) + tangent * off
            bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.035, depth=1.9, location=p)
            bpy.context.active_object.data.materials.append(steel)
        # A cot along the outer wall.
        box(f"cot{k}", (0.85, 2.0, 0.45), polar(a, R_OUT - 0.75, 0.3), a, cot)
    for k in range(CELLS):
        a = ANGLES[k] + math.radians(22.5)
        mid = (R_IN + R_OUT) / 2
        box(f"divider{k}", (R_OUT - R_IN, 0.24, WALL_H), polar(a, mid, WALL_H / 2), a, wall)

    # The shaft stays in place; the lantern's wider, low roof leaves all
    # nine panes visible from the existing high camera, even on a phone.
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=R_TOWER, depth=4.6, location=(0, 0, 2.3))
    bpy.context.active_object.data.materials.append(wall)
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=R_LANTERN + 0.08, depth=0.18, location=(0, 0, 4.61))
    bpy.context.active_object.data.materials.append(wall)
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=R_LANTERN - 0.07, depth=1.6, location=(0, 0, WATCH_Z))
    bpy.context.active_object.data.materials.append(steel)
    windows = []
    for k, a in enumerate(WATCH_ANGLES):
        pane = material(f"watch{k}", (0.075, 0.09, 0.115), 0.42, emit=(1.0, 0.11, 0.035), strength=0.0)
        # A shallow frame and an inset pane, each tangent to the ring.
        box(f"frame{k}", (0.12, 0.65, 1.66), polar(a, R_LANTERN, WATCH_Z), a, wall)
        box(f"pane{k}", (0.04, 0.53, 1.43), polar(a, R_LANTERN + 0.07, WATCH_Z), a, pane)
        # Small dark heads and shoulders make a lit post read as occupied.
        watcher = material(f"watcher{k}", (0.018, 0.012, 0.014), 0.8)
        head = polar(a, R_LANTERN + 0.105, WATCH_Z + 0.12)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.105, location=head)
        bpy.context.active_object.data.materials.append(watcher)
        box(f"shoulders{k}", (0.055, 0.28, 0.34), polar(a, R_LANTERN + 0.105, WATCH_Z - 0.17), a, watcher)
        windows.append(pane)
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=R_LANTERN + 0.1, depth=0.16, location=(0, 0, 6.36))
    bpy.context.active_object.data.materials.append(wall)
    bpy.ops.mesh.primitive_cone_add(vertices=128, radius1=R_LANTERN + 0.15, depth=0.86, location=(0, 0, 6.87))
    bpy.context.active_object.data.materials.append(wall)
    # A mast with two horn loudspeakers on the roof, one to each side:
    # what is announced comes from the tower too.
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.07, depth=1.5, location=(0, 0, 7.95))
    bpy.context.active_object.data.materials.append(steel)
    for a in HORN_ANGLES:
        out = Vector((math.cos(a), math.sin(a), 0.12)).normalized()
        bpy.ops.mesh.primitive_cone_add(
            vertices=48, radius1=0.42, radius2=0.07, depth=0.8, end_fill_type="NOTHING", location=Vector((0, 0, HORN_Z)) + out * 0.5
        )
        horn = bpy.context.active_object
        horn.rotation_euler = (-out).to_track_quat("Z", "Y").to_euler()
        horn.data.materials.append(steel)
        bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.12, depth=0.3, location=Vector((0, 0, HORN_Z)) + out * 0.05)
        driver = bpy.context.active_object
        driver.rotation_euler = out.to_track_quat("Z", "Y").to_euler()
        driver.data.materials.append(steel)
    return windows


def camera(scene):
    cam = bpy.data.cameras.new("cam")
    cam.type = "ORTHO"
    cam.ortho_scale = 27.0
    obj = bpy.data.objects.new("cam", cam)
    scene.collection.objects.link(obj)
    scene.camera = obj
    elev = math.radians(52)
    dist = 60
    obj.location = (0, -dist * math.cos(elev), dist * math.sin(elev) + 1.2)
    target = Vector((0, 0, 1.2))
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()
    return obj


def world(scene, strength, color=(0.03, 0.04, 0.07)):
    w = bpy.data.worlds.new("world")
    scene.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (*color, 1)
    bg.inputs["Strength"].default_value = strength


def light(scene, kind, name, energy, at, color, target=None, size=None, spot=None):
    data = bpy.data.lights.new(name, kind)
    data.energy = energy
    data.color = color
    if size is not None and kind in ("AREA", "POINT", "SPOT"):
        if kind == "AREA":
            data.size = size
        else:
            data.shadow_soft_size = size
    if spot is not None:
        data.spot_size = spot
        data.spot_blend = 0.35
    if kind == "SUN":
        data.angle = math.radians(3)
    obj = bpy.data.objects.new(name, data)
    obj.location = at
    scene.collection.objects.link(obj)
    if target is not None:
        obj.rotation_euler = (Vector(target) - Vector(at)).to_track_quat("-Z", "Y").to_euler()
    return obj


def render(scene, path):
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


def base(path):
    scene = reset()
    build(scene)
    camera(scene)
    world(scene, 1.1, (0.05, 0.065, 0.11))
    # Cold moonlight keeps unoccupied windows dark until their watch pass.
    light(scene, "SUN", "moon", 2.6, (-20, 30, 40), (0.62, 0.72, 1.0), target=(0, 0, 0))
    scene.render.film_transparent = False
    render(scene, path)


def light_pass(k, path):
    scene = reset()
    build(scene)
    camera(scene)
    world(scene, 0.0, (0, 0, 0))
    a = ANGLES[k]
    red = (1.0, 0.07, 0.05)
    # Keep the original sightline; the lamp begins just outside the wider
    # lantern so its body does not block the beam toward the cell.
    original = polar(a, R_TOWER + 0.05, 5.05)
    window = polar(a, R_IN, 1.55)
    start = original.lerp(window, (R_LANTERN + 0.2 - R_TOWER - 0.05) / (R_IN - R_TOWER - 0.05))
    beam_dir = (window - start).normalized()
    # The searchlight from the tower's window through the bars, and a glow
    # inside the cell.
    light(scene, "SPOT", "search", 12000, start, red, target=window, size=0.05, spot=math.radians(16))
    light(scene, "POINT", "cell", 420, polar(a, (R_IN + R_OUT) / 2 + 0.3, 2.4), red, size=0.8)
    # A cone of thin haze along the beam, so the light shows in the air.
    length = (window - start).length + 3.5
    bpy.ops.mesh.primitive_cone_add(
        vertices=64,
        radius1=0.05,
        radius2=length * math.tan(math.radians(9.5)),
        depth=length,
        location=start + beam_dir * (length / 2),
    )
    haze = bpy.context.active_object
    haze.rotation_euler = beam_dir.to_track_quat("Z", "Y").to_euler()
    vol = bpy.data.materials.new("haze")
    vol.use_nodes = True
    nt = vol.node_tree
    for node in list(nt.nodes):
        if node.type == "BSDF_PRINCIPLED":
            nt.nodes.remove(node)
    scatter = nt.nodes.new("ShaderNodeVolumeScatter")
    scatter.inputs["Density"].default_value = 0.45
    out = nt.nodes["Material Output"]
    nt.links.new(scatter.outputs["Volume"], out.inputs["Volume"])
    haze.data.materials.append(vol)
    scene.render.film_transparent = False
    render(scene, path)


def watch_pass(k, path):
    scene = reset()
    windows = build(scene)
    camera(scene)
    world(scene, 0.0, (0, 0, 0))
    # Only one pane emits; its reflected spill stays local to that post.
    windows[k].node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 4.0
    scene.render.film_transparent = False
    render(scene, path)


def points(path):
    scene = reset()
    build(scene)
    cam = camera(scene)
    bpy.context.view_layer.update()

    def project(p):
        co = world_to_camera_view(scene, cam, p)
        return [round(co.x * 100, 3), round((1 - co.y) * 100, 3)]

    cells = []
    centre = project(Vector((0, 0, WALL_H / 2)))
    for a in ANGLES:
        tangent = Vector((-math.sin(a), math.cos(a), 0))
        start = polar(a, R_TOWER + 0.05, 5.05)
        window = polar(a, R_IN, 1.55)
        marks = []
        for t in MARK_T:
            p = start.lerp(window, t)
            marks.append(
                {
                    "at": project(p),
                    "from": project(p - tangent * 0.42),
                    "to": project(p + tangent * 0.42),
                }
            )
        # Behind the tower the label stands above the wall, in front below.
        lift = WALL_H + 0.8 if math.sin(a) > 0 else 0.0
        label = project(polar(a, R_OUT + 1.5, lift))
        cells.append({"label": label, "marks": marks})
    data = {
        "size": [W, H],
        "centre": centre,
        "tower": project(Vector((0, 0, 7.3))),
        "cells": cells,
        "watch": [project(polar(a, R_LANTERN + 0.09, WATCH_Z)) for a in WATCH_ANGLES],
    }
    with open(path, "w") as f:
        json.dump(data, f, indent=1)


# ---------- The later acts: one world, every light on ------------------------
# Scene units are metres: a cell is three metres deep, a cot two long.

# The EU's 27 member states, each with its own account register: ours at
# the origin, the others on a staggered grid around it.
SITE_X, SITE_Y = 30.0, 26.0
SITES = [
    (((i - 2) if j % 2 == 0 else (i - 1.5)) * SITE_X, j * SITE_Y)
    for j in range(-3, 3)
    for i in range(5 if j % 2 == 0 else 4)
]
assert len(SITES) == 27 and (0.0, 0.0) in SITES
YOU = 6  # the crypto cell
A_YOU = ANGLES[YOU]

# Cameras: where they look, from which side and height, how far away, and
# how wide the picture is at that distance. The first is the overview's
# orthographic framing, seen from so far that it comes to the same.
KEYS = {
    "overview": dict(target=(0, 0, 1.2), az=-90, el=52, d=3000, w=27.0),
    "wide": dict(target=(0, -13, 0), az=-90, el=42, d=700, w=172.0),
    # Straight above the place in the cell, so the way down stays inside it.
    "over": dict(target=(0, 0, 3.5), az=math.degrees(A_YOU) - 360, el=22, d=10.3, w=15.0),
    # Above the cell on the way to the yard's side, clear of both walls.
    "lift": dict(target=tuple(polar(A_YOU, 2.0, 2.0)), az=math.degrees(A_YOU) - 360 - 12, el=31, d=8.0, w=11.5),
    "cell": dict(target=(0, 0, 2.7), az=math.degrees(A_YOU) - 360, el=-11.0, d=9.7, w=17.5),
    "leak": dict(target=tuple(polar(A_YOU, 3.5, 0.3)), az=math.degrees(A_YOU) - 360 - 26, el=58, d=8.6, w=9.6),
    "yard": dict(target=(0, -0.2, 1.4), az=-90, el=50, d=34, w=18.5),
    "horn": dict(target=(0, 0, 8.1), az=-90, el=3, d=14, w=10.5),
}
TABLE_A = A_YOU + math.radians(13)
TABLE_AT = polar(TABLE_A, 8.7)
TABLE_Z = 0.74
KEYS["letter"] = dict(
    target=(TABLE_AT.x, TABLE_AT.y, TABLE_Z), az=math.degrees(TABLE_A) - 360, el=70, d=0.6, w=0.43
)
# Above the table, where the camera comes down to the notice and leaves it.
KEYS["table"] = dict(target=(TABLE_AT.x, TABLE_AT.y, TABLE_Z), az=math.degrees(TABLE_A) - 360, el=76, d=4.6, w=4.2)
KEYS["rise"] = dict(target=tuple(polar(A_YOU, 4.0, 1.2)), az=-150, el=60, d=22, w=17.0)
# Which keys a flight runs through; it ends in the still of the same name.
FLIGHTS = {
    1: ["overview", "wide"],
    2: ["wide", "over", "cell"],
    3: ["cell", "lift", "leak"],
    4: ["leak", "table", "letter"],
    5: ["letter", "table", "rise", "yard"],
    6: ["yard", "horn"],
}
# What stands in the world in each flight: the sheets of the leak lie there
# from the leak until the camera leaves the cell again; on the way to the
# yard only the costs stand there, the benefit comes with the next still.
FLIGHT_FRAMES = {1: 36, 2: 48, 3: 32, 4: 32, 5: 44, 6: 28}
FLIGHT_STAGE = {1: "pullback", 2: "field", 3: "leak", 4: "leak", 5: "yard-cost", 6: "yard"}

# The bill, at true scale: a pallet of one million 100-euro notes, 80
# columns of 12,500 on a Euro pallet, is 100 million euros.
PALLET = (1.2, 0.8, 1.35)
COST_PALLETS = 12.5  # 1.251 billion euros a year for three reporting duties
MEASURED_PALLETS = 12  # 1.2 billion euros of benefit measured from data
MODELLED_PALLETS = 56  # 5.6 billion euros from a model
# One sheet per documented data leak, red where it happened at an authority
# (src/data/leaks.ts); the page checks these against its data.
LEAKS, LEAKS_AUTHORITY = 38, 20


def camera_key(scene, key, obj=None):
    if obj is None:
        cam = bpy.data.cameras.new("flycam")
        obj = bpy.data.objects.new("flycam", cam)
        scene.collection.objects.link(obj)
        scene.camera = obj
    cam = obj.data
    cam.type = "PERSP"
    cam.sensor_fit = "HORIZONTAL"
    cam.angle = 2 * math.atan(key["w"] / (2 * key["d"]))
    cam.clip_start = 0.02 if key["d"] < 100 else 10
    cam.clip_end = 20000
    target = Vector(key["target"])
    az, el = math.radians(key["az"]), math.radians(key["el"])
    obj.location = target + Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el))) * key["d"]
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()
    return obj


def between(keys, t):
    # A smooth way through the keys that never swings past one: a monotone
    # cubic on every value, distance and width on a log scale so that a
    # pull-back feels even. Only lightly eased at both ends: the reader's
    # scroll sets the pace, and the frames should lie evenly along the way.
    def values(key):
        return [*key["target"], key["az"], key["el"], math.log(key["d"]), math.log(key["w"])]

    pts = [values(KEYS[name]) for name in keys]
    n = len(pts) - 1
    u = min(max(t, 0.0), 1.0)
    u = 0.65 * u + 0.35 * u * u * (3 - 2 * u)
    x = u * n
    i = min(int(x), n - 1)
    f = x - i
    out = []
    for dim in range(len(pts[0])):
        ys = [p[dim] for p in pts]
        secants = [ys[k + 1] - ys[k] for k in range(n)]
        slopes = [0.0] * (n + 1)
        for k in range(1, n):
            a, b = secants[k - 1], secants[k]
            slopes[k] = 0.0 if a * b <= 0 else 2 * a * b / (a + b)
        y0, y1, m0, m1 = ys[i], ys[i + 1], slopes[i], slopes[i + 1]
        h00 = 2 * f**3 - 3 * f**2 + 1
        h10 = f**3 - 2 * f**2 + f
        h01 = -2 * f**3 + 3 * f**2
        h11 = f**3 - f**2
        out.append(h00 * y0 + h10 * m0 + h01 * y1 + h11 * m1)
    return dict(target=tuple(out[:3]), az=out[3], el=out[4], d=math.exp(out[5]), w=math.exp(out[6]))


def paper(name, color, emit=None, strength=0.0):
    return material(name, color, 0.75, emit=emit, strength=strength)


def lit(scene, windows, haze=True, inside=False):
    # Today's state in one picture: a searchlight into every cell and every
    # window of the lantern occupied. Where the camera goes into the crypto
    # cell, the haze of its beam ends at the window, its glow is dimmer and
    # every searchlight shows its lens, so the view from inside stays clear.
    red = (1.0, 0.07, 0.05)
    made = []
    lens = material("lens", (0, 0, 0), emit=red, strength=40.0) if inside else None
    for k, a in enumerate(ANGLES):
        original = polar(a, R_TOWER + 0.05, 5.05)
        window = polar(a, R_IN, 1.55)
        start = original.lerp(window, (R_LANTERN + 0.2 - R_TOWER - 0.05) / (R_IN - R_TOWER - 0.05))
        yours = inside and k == YOU
        made.append(light(scene, "SPOT", f"search{k}", 12000, start, red, target=window, size=0.05, spot=math.radians(16)))
        made.append(light(scene, "POINT", f"cell{k}", 50 if yours else 420, polar(a, (R_IN + R_OUT) / 2 + 0.3, 2.4), red, size=0.8))
        if lens:
            bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.1, location=start - (window - start).normalized() * 0.12)
            bpy.context.active_object.name = f"haze-lens{k}"
            bpy.context.active_object.data.materials.append(lens)
        if haze:
            beam_dir = (window - start).normalized()
            length = (window - start).length + (-0.3 if yours else 3.5)
            bpy.ops.mesh.primitive_cone_add(
                vertices=64,
                radius1=0.05,
                radius2=length * math.tan(math.radians(9.5)),
                depth=length,
                location=start + beam_dir * (length / 2),
            )
            cone = bpy.context.active_object
            cone.name = f"haze{k}"
            cone.rotation_euler = beam_dir.to_track_quat("Z", "Y").to_euler()
            vol = bpy.data.materials.new("haze")
            vol.use_nodes = True
            nt = vol.node_tree
            for node in list(nt.nodes):
                if node.type == "BSDF_PRINCIPLED":
                    nt.nodes.remove(node)
            scatter = nt.nodes.new("ShaderNodeVolumeScatter")
            scatter.inputs["Density"].default_value = 0.45
            nt.links.new(scatter.outputs["Volume"], nt.nodes["Material Output"].inputs["Volume"])
            cone.data.materials.append(vol)
    for pane in windows:
        pane.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 4.0
    return made


def night(scene):
    world(scene, 1.1, (0.05, 0.065, 0.11))
    # The same light on the world, but a darker sky where the camera sees
    # it past the walls.
    nt = scene.world.node_tree
    out = nt.nodes["World Output"]
    path = nt.nodes.new("ShaderNodeLightPath")
    sky = nt.nodes.new("ShaderNodeBackground")
    sky.inputs["Color"].default_value = (0.028, 0.037, 0.066, 1)
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(path.outputs["Is Camera Ray"], mix.inputs["Fac"])
    nt.links.new(nt.nodes["Background"].outputs["Background"], mix.inputs[1])
    nt.links.new(sky.outputs["Background"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    light(scene, "SUN", "moon", 2.6, (-20, 30, 40), (0.62, 0.72, 1.0), target=(0, 0, 0))


def field(scene):
    # Everything built so far, lights included but not the haze, becomes
    # one collection, set down again at each of the other 26 sites.
    coll = bpy.data.collections.new("register")
    scene.collection.children.link(coll)
    for obj in list(scene.collection.objects):
        if obj.name.startswith(("haze", "flycam", "cam", "moon")) or obj.type == "CAMERA":
            continue
        if obj.type == "MESH" and obj.dimensions.x > 150:
            obj.scale = (12, 12, 1)  # the ground reaches under every site
            continue
        scene.collection.objects.unlink(obj)
        coll.objects.link(obj)
    for n, (x, y) in enumerate(SITES):
        if (x, y) == (0.0, 0.0):
            continue
        inst = bpy.data.objects.new(f"site{n}", None)
        inst.instance_type = "COLLECTION"
        inst.instance_collection = coll
        inst.location = (x, y, 0)
        scene.collection.objects.link(inst)


def neighbours():
    pairs = []
    for i, a in enumerate(SITES):
        for b in SITES[i + 1 :]:
            if math.dist(a, b) < SITE_X * 1.1:
                pairs.append((a, b))
    return pairs


LINK_Z = 9.0


def links(scene):
    # The registers connected: a red line from tower to tower.
    glow = material("link", (0, 0, 0), emit=(1.0, 0.09, 0.05), strength=14.0)
    for a, b in neighbours():
        p, q = Vector((*a, LINK_Z)), Vector((*b, LINK_Z))
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.28, depth=(q - p).length, location=(p + q) / 2)
        tube = bpy.context.active_object
        tube.rotation_euler = (q - p).to_track_quat("Z", "Y").to_euler()
        tube.data.materials.append(glow)


def tag_points():
    # A tag on every other link, a third of the way along: the data that
    # ride on a payment across a border.
    return [
        Vector((*a, LINK_Z)).lerp(Vector((*b, LINK_Z)), 0.36 + 0.3 * ((n * 7) % 3) / 2)
        for n, (a, b) in enumerate(neighbours())
        if n % 3 == 0
    ]


def tags(scene):
    # The tags show to the camera only and light nothing around them.
    glow = material("tag", (0, 0, 0), emit=(1.0, 0.96, 0.9), strength=9.0)
    for p in tag_points():
        tag = box("tag", (2.6, 1.7, 0.3), p + Vector((0, 0, 0.6)), 0, glow)
        tag.visible_diffuse = False
        tag.visible_glossy = False


def furnish(scene, lang=None):
    # The crypto cell gets a table with a notice on it and a lamp above, so
    # the notice reads in the red of the cell. The lines of the notice run
    # along the tangent, its top towards the tower: readable from where the
    # camera comes down. Only a still carries the word before the bar.
    wood = material("table", (0.16, 0.13, 0.11), 0.6)
    a = TABLE_A
    box("tabletop", (0.62, 0.95, 0.04), TABLE_AT + Vector((0, 0, TABLE_Z - 0.02)), a, wood)
    radial, tangent = polar(a, 1), Vector((-math.sin(a), math.cos(a), 0))
    for sr in (-1, 1):
        for st in (-1, 1):
            at = TABLE_AT + radial * (0.27 * sr) + tangent * (0.43 * st) + Vector((0, 0, (TABLE_Z - 0.04) / 2))
            box("leg", (0.04, 0.04, TABLE_Z - 0.04), at, a, wood)
    sheet = paper("sheet", (0.86, 0.85, 0.81))
    ink = material("ink", (0.05, 0.05, 0.055), 0.6)
    faint = material("faint", (0.42, 0.42, 0.42), 0.7)
    black = material("black", (0.004, 0.004, 0.005), 0.35)
    z = TABLE_Z + 0.001
    box("notice", (0.297, 0.21, 0.002), TABLE_AT + Vector((0, 0, z)), a, sheet)

    def on(u, v):
        # u from the left edge, v from the top edge, in metres.
        return TABLE_AT + tangent * (u - 0.105) + radial * (v - 0.1485) + Vector((0, 0, z + 0.002))

    def line(u, v, length, mat=faint, height=0.0042):
        box("line", (height, length, 0.0008), on(u + length / 2, v), a, mat)

    line(0.022, 0.026, 0.06, ink, 0.011)  # the bank's letterhead
    for k, length in enumerate((0.07, 0.055, 0.062)):
        line(0.022, 0.058 + k * 0.011, length)  # to whom
    line(0.022, 0.108, 0.105, ink, 0.0062)  # the subject
    for k, length in enumerate((0.166, 0.158, 0.166, 0.09)):
        line(0.022, 0.132 + k * 0.011, length)
    # "Reason:" and the bar over what follows it.
    if lang:
        bpy.ops.object.text_add(location=on(0.022, 0.196))
        word = bpy.context.active_object
        word.data.body = {"de": "Grund:", "en": "Reason:"}[lang]
        word.data.size = 0.0125
        word.data.extrude = 0.0002
        word.rotation_euler = (0, 0, a + math.radians(90))
        word.data.materials.append(ink)
    start = 0.074 if lang == "de" else 0.084
    line(start, 0.1915, 0.188 - start, black, 0.0125)
    for k, length in enumerate((0.166, 0.12)):
        line(0.022, 0.216 + k * 0.011, length)
    line(0.022, 0.262, 0.048, ink, 0.003)  # a signature
    light(scene, "POINT", "lamp", 9, TABLE_AT + Vector((0, 0, TABLE_Z + 0.85)), (1.0, 0.93, 0.82), size=0.12)


def breach(scene, shaft):
    # A ragged hole at the foot of the tower, on the crypto cell's side,
    # and light from inside it.
    rng = random.Random(8)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0, location=polar(A_YOU, R_TOWER - 0.1, 0.75))
    hole = bpy.context.active_object
    for v in hole.data.vertices:
        v.co *= 0.7 + rng.random() * 0.6
    tangent = Vector((-math.sin(A_YOU), math.cos(A_YOU), 0))
    hole.rotation_euler[2] = A_YOU
    hole.scale = (0.8, 1.25, 0.95)
    mod = shaft.modifiers.new("breach", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = hole
    hole.hide_render = True
    hole.hide_viewport = True
    light(scene, "POINT", "inside", 5, polar(A_YOU, R_TOWER - 0.6, 0.7), (1.0, 0.8, 0.55), size=0.2)


def sheet_points():
    # One sheet per case, fanning out of the breach across the yard, spread
    # evenly and kept clear of the wall the camera looks over, so that
    # every one of them shows.
    rng = random.Random(21)
    reds = set(rng.sample(range(LEAKS), LEAKS_AUTHORITY))
    out = []
    for n in range(LEAKS):
        t = (n + 0.5) / LEAKS
        r = R_TOWER + 0.45 + 2.55 * math.sqrt(t)
        spread = 18 + 26 * t
        a = A_YOU + math.radians(((n * 0.618034) % 1 * 2 - 1) * spread)
        # The first few are still in the air.
        z = 0.06 + (max(0.0, 0.16 - t) * 5.5) ** 2
        out.append((polar(a, r, z), n in reds, rng.uniform(0, math.pi), t))
    return out


def spill(scene):
    plain = paper("leaksheet", (0.8, 0.82, 0.86), emit=(0.8, 0.86, 1.0), strength=0.5)
    red = paper("leakred", (0.75, 0.1, 0.07), emit=(1.0, 0.1, 0.05), strength=1.6)
    rng = random.Random(5)
    for k, (at, authority, turn, t) in enumerate(sheet_points()):
        # Laid one over the other like fallen paper, each a little higher.
        sheet = box("leaf", (0.5, 0.35, 0.012), at + Vector((0, 0, k * 0.004)), turn, red if authority else plain)
        if t < 0.16:
            sheet.rotation_euler[0] = rng.uniform(-0.9, 0.9)
            sheet.rotation_euler[1] = rng.uniform(-0.7, 0.7)


def pallet_slots():
    # Places in the yard, ring by ring around the tower.
    slots = []
    for r in (2.5, 3.5, 4.5, 5.5, 6.3):
        count = int(2 * math.pi * r / 1.45)
        for k in range(count):
            a = math.radians(-90) + (k + 0.5) * 2 * math.pi / count
            slots.append((r, math.atan2(math.sin(a), math.cos(a))))
    return slots


def pallet_groups():
    # Costs to the camera's left, the measured benefit to its right, and
    # the modelled benefit in what is left of the yard, back to front.
    slots = pallet_slots()
    front = lambda s: abs(s[1] + math.pi / 2)
    left = sorted((s for s in slots if s[1] < -math.pi / 2 or s[1] > math.radians(170)), key=front)
    right = sorted((s for s in slots if -math.pi / 2 <= s[1] < math.radians(10)), key=front)
    cost = left[: math.ceil(COST_PALLETS)]
    measured = right[:MEASURED_PALLETS]
    rest = sorted((s for s in slots if s not in cost and s not in measured), key=front)
    modelled = rest[:MODELLED_PALLETS]
    assert len(cost) == 13 and len(measured) == 12 and len(modelled) == 56, (len(cost), len(measured), len(modelled))
    return cost, measured, modelled


def notes_material(name, tint):
    # Banded bricks of notes: paper with a fine horizontal grain on the
    # sides and the outline of the bundles on top.
    mat = material(name, tint, 0.7)
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    brick = nt.nodes.new("ShaderNodeTexBrick")
    brick.offset = 0.0
    brick.inputs["Scale"].default_value = 1.0
    brick.inputs["Mortar Size"].default_value = 0.012
    brick.inputs["Brick Width"].default_value = 0.147
    brick.inputs["Row Height"].default_value = 0.077
    brick.inputs["Color1"].default_value = (*tint, 1)
    brick.inputs["Color2"].default_value = (*[c * 0.9 for c in tint], 1)
    brick.inputs["Mortar"].default_value = (*[c * 0.28 for c in tint], 1)
    nt.links.new(coord.outputs["Object"], brick.inputs["Vector"])
    nt.links.new(brick.outputs["Color"], bsdf.inputs["Base Color"])
    return mat


def pallets(scene, benefit):
    wood = material("pallet", (0.3, 0.22, 0.14), 0.8)
    grey = notes_material("notes", (0.62, 0.66, 0.6))
    red = notes_material("notes-benefit", (0.78, 0.2, 0.16))
    ghost = material("ghost", (0, 0, 0), emit=(0.75, 0.82, 1.0), strength=2.4)
    cost, measured, modelled = pallet_groups()
    w, d, h = PALLET

    def stack(slot, mat, share=1.0):
        r, a = slot
        box("palletwood", (d, w, 0.144), polar(a, r, 0.072 + 0.04), a, wood)
        box("palletnotes", (d * 0.97, w * 0.98, h * share), polar(a, r, 0.184 + h * share / 2), a, mat)

    for n, slot in enumerate(cost):
        stack(slot, grey, 1.0 if n < int(COST_PALLETS) else COST_PALLETS % 1)
    if not benefit:
        return
    for slot in measured:
        stack(slot, red)
    for r, a in modelled:
        frame = box("ghost", (d, w, h + 0.144), polar(a, r, 0.04 + (h + 0.144) / 2), a, ghost)
        mod = frame.modifiers.new("wire", "WIREFRAME")
        mod.thickness = 0.035


def yard_light(scene):
    # A work light over the yard, so the notes read at night.
    light(scene, "AREA", "work", 2600, (0, -3, 13), (0.9, 0.93, 1.0), target=(0, 0, 0), size=9)


def stage(scene, name, lang=None, benefit=True):
    # The world as it stands in a still or a flight.
    windows = build(scene)
    if name in ("leak",):
        shaft = next(o for o in scene.objects if o.type == "MESH" and abs(o.dimensions.z - 4.6) < 0.01)
        breach(scene, shaft)
        spill(scene)
    if name in ("field", "leak", "letter", "yard"):
        furnish(scene, lang)
    if name == "yard":
        pallets(scene, benefit)
        yard_light(scene)
    if name in ("field", "pullback"):
        lit(scene, windows, haze=False)
        field(scene)
        # The haze of our own searchlights, which the other sites do without.
        for obj in lit(scene, [], haze=True, inside=name == "field"):
            bpy.data.objects.remove(obj)
        if name == "field":
            # Seen from inside, our own cell glows less than the others.
            you = bpy.data.objects[f"cell{YOU}"]
            you.data = you.data.copy()
            you.data.energy = 50
    else:
        lit(scene, windows, inside=True)
    night(scene)


def still(name, path, stage_name, **more):
    scene = reset()
    stage(scene, stage_name, **more)
    camera_key(scene, KEYS[name])
    scene.render.film_transparent = False
    render(scene, path)


def wide_pass(which, path):
    # Only the links, or only the tags, glowing over a black world.
    scene = reset()
    build(scene)
    field(scene)
    world(scene, 0.0, (0, 0, 0))
    (links if which == "links" else tags)(scene)
    camera_key(scene, KEYS["wide"])
    render(scene, path)


def proposal(path):
    # In the overview's camera: three windows in the shaft, low
    # enough to show below the lantern, lit on black, for an access that is
    # proposed and not yet law.
    scene = reset()
    build(scene)
    camera(scene)
    world(scene, 0.0, (0, 0, 0))
    glow = material("proposal", (0.02, 0.02, 0.02), emit=(1.0, 0.42, 0.2), strength=7.0)
    for k in range(3):
        a = math.radians(-90 + (k - 1) * 36)
        box("slit", (0.05, 0.28, 0.95), polar(a, R_TOWER + 0.01, 2.25), a, glow)
    render(scene, path)


def flight(n, out):
    scene = reset()
    name = FLIGHT_STAGE[n]
    stage(scene, name.split("-")[0], benefit=name != "yard-cost")
    cam = camera_key(scene, KEYS[FLIGHTS[n][0]])
    scene.render.resolution_x, scene.render.resolution_y = 1000, 900
    frames = int(os.environ.get("FRAMES", FLIGHT_FRAMES[n]))
    step = int(os.environ.get("STEP", 1))
    os.makedirs(out, exist_ok=True)
    for f in range(0, frames, step):
        camera_key(scene, between(FLIGHTS[n], f / (frames - 1)), cam)
        render(scene, os.path.join(out, f"{f:02d}.png"))


def world_points(path):
    # Where the page sets words into the stills, in percent of the picture.
    scene = reset()
    build(scene)

    def project(name, p):
        cam = camera_key(scene, KEYS[name])
        bpy.context.view_layer.update()
        co = world_to_camera_view(scene, cam, Vector(p))
        bpy.data.objects.remove(cam)
        return [round(co.x * 100, 2), round((1 - co.y) * 100, 2)]

    def centre(slots, z):
        x = sum(math.cos(a) * r for r, a in slots) / len(slots)
        y = sum(math.sin(a) * r for r, a in slots) / len(slots)
        return (x, y, z)

    cost, measured, modelled = pallet_groups()
    back = [s for s in modelled if s[1] > 0]
    tag = min(tag_points(), key=lambda p: abs(p.x - 20) + abs(p.y + 40))
    data = {
        "size": [W, H],
        "wide": {"home": project("wide", (0, 0, 12)), "tag": project("wide", tag)},
        "yard": {
            "cost": project("yard", centre(cost, 2.6)),
            "measured": project("yard", centre(measured, 2.6)),
            "modelled": project("yard", centre(back, 3.0)),
        },
        "horn": {
            "left": project("horn", (-1.6, 0, HORN_Z + 0.1)),
            "right": project("horn", (1.6, 0, HORN_Z + 0.1)),
            "lantern": project("horn", (0, 0, WATCH_Z)),
        },
    }
    with open(path, "w") as f:
        json.dump(data, f, indent=1)



os.makedirs(OUT, exist_ok=True)
if ONLY in (None, "points"):
    points(os.path.join(OUT, "panopticon.json"))
if ONLY in (None, "base"):
    base(os.path.join(OUT, "base.png"))
for k in range(CELLS):
    if ONLY in (None, f"light{k}"):
        light_pass(k, os.path.join(OUT, f"light{k}.png"))
for k in range(len(WATCH_ANGLES)):
    if ONLY in (None, f"watch{k}"):
        watch_pass(k, os.path.join(OUT, f"watch{k}.png"))

# The later acts are rendered only when asked for by name.
if ONLY == "proposal":
    proposal(os.path.join(OUT, "proposal.png"))
if ONLY == "wide":
    still("wide", os.path.join(OUT, "wide.png"), "pullback")
if ONLY in ("wide-links", "wide-tags"):
    wide_pass(ONLY[5:], os.path.join(OUT, f"{ONLY}.png"))
if ONLY == "cell":
    still("cell", os.path.join(OUT, "cell.png"), "field")
if ONLY == "leak":
    still("leak", os.path.join(OUT, "leak.png"), "leak")
if ONLY in ("letter-de", "letter-en"):
    still("letter", os.path.join(OUT, f"{ONLY}.png"), "letter", lang=ONLY[-2:])
if ONLY in ("yard-cost", "yard-benefit"):
    still("yard", os.path.join(OUT, f"{ONLY}.png"), "yard", benefit=ONLY == "yard-benefit")
if ONLY == "horn":
    still("horn", os.path.join(OUT, "horn.png"), "yard")
if ONLY == "world":
    world_points(os.path.join(OUT, "world.json"))
if ONLY and ONLY.startswith("flight"):
    flight(int(ONLY[6:]), os.path.join(OUT, ONLY))
