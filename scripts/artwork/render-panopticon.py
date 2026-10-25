# Renders the rules chapter of the history film as a panopticon at night:
# a ring of eight cells with barred windows onto a courtyard, a watchtower
# in the middle. One base picture, and for each cell a light pass with only
# a red searchlight from the tower through its window and a glow inside,
# on black, so the page can add each cell's light by screen blending as
# the years run. Nine separate watch passes light the observation windows
# for the next chapter. Add them cumulatively: 0..2, then 0..7, then 0..8.
# The script writes cell labels, marks, the tower top and window centres
# as percentages of the picture, keeping every pass on the same camera.
# Usage: blender -b -P scripts/artwork/render-panopticon.py -- <outdir> [pass]
#   pass: "base", "light0".."light7", "watch0".."watch8", "points", or all.
# Outputs PNGs; export to panopticon-{base,light-0..7,watch-0..8}.webp at
# quality 82, without resizing. SAMPLES/PCT lower the cost of previews.
# Before encoding light/watch passes, subtract 1/255 from RGB so render
# dithering cannot lift black when the page screen-blends many passes.
# Add -noaudio to the Blender command on machines without an audio server.
import json
import math
import os
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1 :]
OUT = args[0]
ONLY = args[1] if len(args) > 1 else None
if ONLY == "all":
    ONLY = None
if ONLY is not None and ONLY not in ("base", "points", *[f"light{k}" for k in range(8)], *[f"watch{k}" for k in range(9)]):
    raise ValueError(f"Unknown panopticon pass: {ONLY}")
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
