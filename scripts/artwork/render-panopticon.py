# Renders the history film: one world, a panopticon at night. A ring of
# eight cells with barred windows onto a courtyard, a watchtower in the
# middle, two loudspeakers on its roof, and in the crypto cell a table
# under a lamp. Scene units are metres.
#
# The overview, on one orthographic camera, is layered by the page:
#   base        the ring at night, every searchlight off
#   light0..7   per cell, only a red searchlight from the tower through
#               its window and a glow inside, on black; the page adds each
#               by screen blending as the years run
#   watch0..8   per observation window of the lantern, its light on black.
#               Add them cumulatively: 0..2, then 0..7, then 0..8.
#   proposal    a row of windows in the shaft that are not yet open
#   base-late, light6-late   the same once the pages hang in the crypto cell
#   points      cell labels, marks, tower top and window centres in
#               percent of the picture (panopticon.json)
#
# The stills, on a perspective camera in the same world (STILLS):
#   cash, gold, cent   the table: 339 and 100 hundred-euro notes, the same
#               limits in gold coins, and a cent
#   wall6, wall the cell's walls with one sheet per Official Journal page
#   reports, kept, convictions   the yard with one slip per suspicion
#               report, those kept on file pale, the convictions red
#   note        a 100-euro note with the state's share torn off
#   wide        the EU's 27 account registers as 27 panopticons, with the
#               passes wide-links and wide-tags on black for the links
#               between them and the data riding on payments
#   cell        the view from inside the crypto cell through the bars
#   leak        a breach in the tower and one sheet per documented data leak
#   letter-de, letter-en   a notice on the table, its reason blacked out
#   yard-cost, yard-benefit   pallets of 100-euro notes at true scale
#   horn        the loudspeakers on the tower
#   world       where the page sets words into the stills (world.json)
#
# The clips (CLIPS), clip-<name>: the camera's way from one still to the
# next as frames with motion blur, and what happens on the way: pages fly
# on to the walls, reports rain into the yard, sheets burst out of the
# breach, pallets drop. "check" prints whether any camera path runs through
# something built.
#
# Usage: blender -b -P scripts/artwork/render-panopticon.py -- <outdir> [pass]
#   without a pass: the overview's passes. SAMPLES/PCT lower the cost of
#   previews; DEVICE=GPU renders on OptiX; STEP renders every n-th frame of
#   a clip. Add -noaudio on machines without an audio server.
# Export, without resizing, at WebP quality 82:
#   base, base-late, light*, watch*, proposal to
#   src/assets/history/panopticon-{base,base-late,light-0..7,light-6-late,
#   watch-0..8,proposal}.webp; stills and wide passes to world-<name>.webp.
#   Before encoding light, watch, proposal and wide passes, subtract 1/255
#   from RGB so render dithering cannot lift black when the page
#   screen-blends many passes.
# Clips: ffmpeg -framerate 24 -i <outdir>/clip-<name>/%04d.png -c:v libx264
#   -preset slow -crf 23 -pix_fmt yuv420p -colorspace bt709 -color_primaries
#   bt709 -color_trc iec61966-2-1 -movflags +faststart -an
#   public/film/<name>.mp4
# The counts near the top of the world section are checked by the page
# (src/components/RuleFilm.astro) against its data; when it fails the
# build, set them here and render the stills and clips concerned again.
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
NOTE_PICTURE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "note100.webp")
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


def base(path, late=False):
    scene = reset()
    overview_world(scene, late, lamp=True)
    camera(scene)
    world(scene, 1.1, (0.05, 0.065, 0.11))
    # Cold moonlight keeps unoccupied windows dark until their watch pass.
    light(scene, "SUN", "moon", 2.6, (-20, 30, 40), (0.62, 0.72, 1.0), target=(0, 0, 0))
    scene.render.film_transparent = False
    render(scene, path)


def light_pass(k, path, late=False):
    scene = reset()
    overview_world(scene, late, lamp=False, glow=False)
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
    windows = overview_world(scene, False, lamp=False)
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


# ---------- One world for the whole film --------------------------------------
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
CASH = 7  # the cash cell, dark until 2027
A_YOU = ANGLES[YOU]
DEG_YOU = math.degrees(A_YOU)

# The table in the crypto cell stands to one side and faces the barred
# window. Things on it are placed by u, to the right of someone sitting at
# it with the window in front, and v, towards them.
TABLE_AT = polar(A_YOU + math.radians(13), 8.7)
TABLE_Z = 0.74
_seat = TABLE_AT - polar(A_YOU, R_IN)
TABLE_A = math.atan2(_seat.y, _seat.x)
TABLE_DEG = DEG_YOU + math.degrees((TABLE_A - A_YOU + math.pi) % (2 * math.pi) - math.pi)
RADIAL = polar(TABLE_A, 1)
TANGENT = Vector((-math.sin(TABLE_A), math.cos(TABLE_A), 0))


def on_table(u, v, z=0.0):
    return TABLE_AT + TANGENT * u + RADIAL * v + Vector((0, 0, TABLE_Z + z))


# What the pictures count; the page checks each against its data.
NOTES_1991, NOTES_2027 = 339, 100  # 100-euro notes: 33,900 and 10,000 euros
OUNCES_1991 = 47  # the same limits in gold: 47 ounces, then 2.7
PAGES, PAGES_1991 = 488, 6
PAGE_BLOCKS = [6, 7, 22, 15, 63, 41, 39, 295]  # pages adopted, act by act
REPORTS, REPORTS_KEPT, CONVICTIONS = 13989, 9665, 139
STATE_SHARE = 0.02  # of 100 euros criminals make, the state takes two
# The bill, at true scale: a pallet of one million 100-euro notes, 80
# columns of 12,500 on a Euro pallet, is 100 million euros.
PALLET = (1.2, 0.8, 1.35)
COST_PALLETS = 12.5  # 1.251 billion euros a year for three reporting duties
MEASURED_PALLETS = 12  # 1.2 billion euros of benefit measured from data
MODELLED_PALLETS = 56  # 5.6 billion euros from a model
# One sheet per documented data leak, red where it happened at an authority.
LEAKS, LEAKS_AUTHORITY = 38, 20
assert sum(PAGE_BLOCKS) == PAGES and PAGE_BLOCKS[0] == PAGES_1991

NOTE_W, NOTE_H, NOTE_T = 0.147, 0.077, 0.000108
PILE_U, PILE_V = 0.15, -0.05
CENT_AT = (0.0, 0.12)
PATCH_AT = polar(math.radians(-90), 4.75)

# Cameras: where they look, from which side and height, how far away, how
# wide the picture is at that distance, and the lens opening in metres
# where the background is to blur. The first is the overview's
# orthographic framing, seen from so far that it comes to the same.
WALL_AT = polar(A_YOU, R_OUT - 0.01, 1.6)
KEYS = {
    "overview": dict(target=(0, 0, 1.2), az=-90, el=52, d=3000, w=27.0),
    "wide": dict(target=(0, -13, 0), az=-90, el=42, d=700, w=172.0),
    # The table: the two limits side by side, then the cent between them.
    "cash": dict(target=tuple(on_table(0, 0.02, 0.035)), az=TABLE_DEG, el=17, d=0.8, w=0.56, ap=0.0022),
    "cent": dict(target=tuple(on_table(*CENT_AT, 0.004)), az=TABLE_DEG, el=15, d=0.3, w=0.24, ap=0.006),
    "note": dict(target=tuple(on_table(-0.006, 0.0)), az=TABLE_DEG, el=64, d=0.3, w=0.23, ap=0.0012),
    "letter": dict(target=tuple(on_table(0, 0)), az=TABLE_DEG, el=70, d=0.6, w=0.43),
    # Above the table, where the camera comes down to it and leaves it.
    "table": dict(target=tuple(on_table(0, 0)), az=TABLE_DEG, el=76, d=4.6, w=4.2),
    "rise": dict(target=tuple(polar(A_YOU, 4.0, 1.2)), az=-150, el=60, d=22, w=17.0),
    # The cell's walls from inside, the tower behind the camera.
    "wall6": dict(target=tuple(WALL_AT - Vector((0, 0, 0.2))), az=DEG_YOU + 180, el=1, d=2.2, w=2.7),
    # Above the cell, where the camera crosses its inner wall.
    "hop": dict(target=tuple(WALL_AT), az=DEG_YOU + 180, el=42, d=2.7, w=4.6),
    # The whole cell from above its inner wall, all three walls in view.
    "wall": dict(target=tuple(polar(A_YOU, 9.2, 1.3)), az=DEG_YOU + 180, el=45, d=4.6, w=9.6),
    "hover": dict(target=tuple(polar(A_YOU, 6.0, 1.5)), az=-60, el=52, d=17, w=14.0),
    "yard": dict(target=(0, -0.2, 1.4), az=-90, el=50, d=34, w=18.5),
    # Straight above the place in the cell, so the way down stays inside it.
    "over": dict(target=(0, 0, 3.5), az=DEG_YOU, el=22, d=10.3, w=15.0),
    "cell": dict(target=(0, 0, 2.7), az=DEG_YOU, el=-11.0, d=9.7, w=17.5),
    # Above the cell on the way to the yard's side, clear of both walls.
    "lift": dict(target=tuple(polar(A_YOU, 2.0, 2.0)), az=DEG_YOU - 12, el=31, d=8.0, w=11.5),
    "leak": dict(target=tuple(polar(A_YOU, 3.5, 0.3)), az=DEG_YOU - 26, el=58, d=8.6, w=9.6),
    "horn": dict(target=(0, 0, 8.1), az=-90, el=3, d=14, w=10.5),
}


def camera_key(scene, key, obj=None):
    if obj is None:
        cam = bpy.data.cameras.new("flycam")
        obj = bpy.data.objects.new("flycam", cam)
        obj.rotation_mode = "QUATERNION"
        scene.collection.objects.link(obj)
        scene.camera = obj
    cam = obj.data
    cam.type = "PERSP"
    cam.sensor_fit = "HORIZONTAL"
    cam.angle = 2 * math.atan(key["w"] / (2 * key["d"]))
    cam.clip_start = 0.02
    cam.clip_end = 20000
    target = Vector(key["target"])
    az, el = math.radians(key["az"]), math.radians(key["el"])
    obj.location = target + Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el))) * key["d"]
    turn = (target - obj.location).to_track_quat("-Z", "Y")
    # The same turn has two signs; keep the one nearer the last frame's.
    if obj.rotation_quaternion.dot(turn) < 0:
        turn.negate()
    obj.rotation_quaternion = turn
    ap = key.get("ap", 0.0)
    cam.dof.use_dof = True
    cam.dof.focus_distance = key["d"]
    cam.dof.aperture_fstop = min(256.0, cam.lens / 1000 / ap) if ap > 1e-5 else 256.0
    return obj


def between(keys, t):
    # A smooth way through the keys that never swings past one: a monotone
    # cubic on every value, distance and width on a log scale so that a
    # pull-back feels even, starting and ending at rest.
    def values(key):
        return [*key["target"], key["az"], key["el"], math.log(key["d"]), math.log(key["w"]), key.get("ap", 0.0)]

    pts = [values(KEYS[name]) for name in keys]
    n = len(pts) - 1
    u = min(max(t, 0.0), 1.0)
    u = u * u * u * (u * (6 * u - 15) + 10)
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
    return dict(target=tuple(out[:3]), az=out[3], el=out[4], d=math.exp(out[5]), w=math.exp(out[6]), ap=max(0.0, out[7]))


def paper(name, color, emit=None, strength=0.0):
    return material(name, color, 0.75, emit=emit, strength=strength)


def textured(name, image, tint=(1, 1, 1), glow=0.0, rough=0.6):
    # A picture on a sheet, tinted, and glowing a little where the cell's
    # red light would otherwise swallow its colour.
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = image
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs["Factor"].default_value = 1.0
    mix.inputs["B"].default_value = (*tint, 1)
    nt.links.new(tex.outputs["Color"], mix.inputs["A"])
    nt.links.new(mix.outputs["Result"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = rough
    if glow:
        nt.links.new(mix.outputs["Result"], bsdf.inputs["Emission Color"])
        bsdf.inputs["Emission Strength"].default_value = glow
    return mat


def page_image():
    # A printed page: a heading and lines of text in two columns, as in
    # the Official Journal.
    w, h = 84, 119
    px = [0.0] * (w * h * 4)

    def put(x, y, c):
        i = ((h - 1 - y) * w + x) * 4
        px[i : i + 4] = (c, c, c * 0.97, 1.0)

    for y in range(h):
        for x in range(w):
            put(x, y, 0.9)
    for x in range(22, 62):
        for y in (9, 10):
            put(x, y, 0.2)
    rng = random.Random(3)
    for col in (8, 45):
        for row in range(30):
            y = 18 + row * 3
            length = 31 if rng.random() > 0.18 else rng.randrange(10, 26)
            for x in range(col, col + length):
                put(x, y, 0.5)
    image = bpy.data.images.new("page", w, h)
    image.pixels.foreach_set(px)
    image.update()
    return image


def sheet(name, size, at, x_axis, y_axis, mat):
    # A flat sheet with its picture's left-to-right along x_axis and its
    # bottom-to-top along y_axis.
    bpy.ops.mesh.primitive_plane_add(size=1, location=at)
    obj = bpy.context.active_object
    obj.name = name
    x, y = Vector(x_axis).normalized(), Vector(y_axis).normalized()
    z = x.cross(y)
    obj.rotation_mode = "QUATERNION"
    from mathutils import Matrix

    obj.rotation_quaternion = Matrix((x, y, z)).transposed().to_quaternion()
    obj.scale = (size[0], size[1], 1)
    obj.data.materials.append(mat)
    return obj


def lit(scene, windows, haze=True, inside=False, skip=()):
    # A searchlight into every cell and every window of the lantern
    # occupied. Where the camera goes into the crypto cell, the haze of its
    # beam ends at the window, its glow is dimmer and every searchlight
    # shows its lens, so the view from inside stays clear.
    red = (1.0, 0.07, 0.05)
    made = []
    lens = material("lens", (0, 0, 0), emit=red, strength=40.0) if inside else None
    for k, a in enumerate(ANGLES):
        if k in skip:
            continue
        original = polar(a, R_TOWER + 0.05, 5.05)
        window = polar(a, R_IN, 1.55)
        start = original.lerp(window, (R_LANTERN + 0.2 - R_TOWER - 0.05) / (R_IN - R_TOWER - 0.05))
        yours = inside and k == YOU
        made.append(light(scene, "SPOT", f"search{k}", 5000 if yours else 12000, start, red, target=window, size=0.05, spot=math.radians(16)))
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


def furniture(scene, lamp=9):
    # The crypto cell gets a table and a lamp above it: the one warm light
    # in the picture, where the reader sits.
    wood = material("table", (0.16, 0.13, 0.11), 0.6)
    a = TABLE_A
    box("tabletop", (0.62, 0.95, 0.04), TABLE_AT + Vector((0, 0, TABLE_Z - 0.02)), a, wood)
    for sr in (-1, 1):
        for st in (-1, 1):
            at = TABLE_AT + RADIAL * (0.27 * sr) + TANGENT * (0.43 * st) + Vector((0, 0, (TABLE_Z - 0.04) / 2))
            box("leg", (0.04, 0.04, TABLE_Z - 0.04), at, a, wood)
    if lamp:
        bulb = light(scene, "POINT", "lamp", lamp, TABLE_AT + Vector((0, 0, TABLE_Z + 0.85)), (1.0, 0.93, 0.82), size=0.12)
        bulb.visible_camera = False


def notes(u, v, z, count, turn, face, edge, band=None):
    # A pile of notes at true size: the paper's edge on the sides, the
    # note's picture on top, a band around a bundle of a hundred.
    h = count * NOTE_T
    box("notes", (NOTE_H, NOTE_W, h), on_table(u, v, z + h / 2), TABLE_A + turn, edge)
    a = TABLE_A + turn
    x = Vector((-math.sin(a), math.cos(a), 0))
    sheet("noteface", (NOTE_W, NOTE_H), on_table(u, v, z + h + 0.00004), x, Vector((-math.cos(a), -math.sin(a), 0)), face)
    if band:
        box("band", (NOTE_H + 0.0008, 0.03, h + 0.0005), on_table(u, v, z + h / 2), a, band)
    return z + h


def coin(u, v, z, radius, thick, mat, rng=None):
    if rng:
        u, v = u + rng.uniform(-0.0006, 0.0006), v + rng.uniform(-0.0006, 0.0006)
    bpy.ops.mesh.primitive_cylinder_add(vertices=72, radius=radius, depth=thick, location=on_table(u, v, z + thick / 2))
    obj = bpy.context.active_object
    for face in obj.data.polygons:
        face.use_smooth = len(face.vertices) == 4
    bevel = obj.modifiers.new("rim", "BEVEL")
    bevel.width = thick * 0.18
    bevel.segments = 2
    obj.data.materials.append(mat)
    return z + thick


def cash(scene, gold):
    # What one transaction without an account could move without ID: 339
    # notes of 100 euros in 1991, in today's money, and 100 from 2027; in
    # front of each the same limit in gold coins of an ounce and less; and
    # between them a cent, for crypto.
    face = textured("note", bpy.data.images.load(NOTE_PICTURE))
    edge = material("noteedge", (0.66, 0.7, 0.62), 0.8)
    band = material("band", (0.88, 0.86, 0.8), 0.7)
    rng = random.Random(1991)
    z = 0.0
    for k in range(NOTES_1991 // 100):
        z = notes(-PILE_U + rng.uniform(-0.002, 0.002), PILE_V + rng.uniform(-0.002, 0.002), z, 100, rng.uniform(-0.03, 0.03), face, edge, band)
    notes(-PILE_U + 0.003, PILE_V - 0.002, z, NOTES_1991 % 100, 0.07, face, edge)
    notes(PILE_U, PILE_V, 0.0, NOTES_2027, -0.03, face, edge, band)
    copper = material("copper", (0.72, 0.33, 0.2), 0.32, 1.0)
    coin(*CENT_AT, 0.0, 0.008125, 0.00167, copper)
    if not gold:
        return
    metal = material("gold", (1.0, 0.66, 0.22), 0.24, 1.0)
    ounce, half, tenth = (0.0185, 0.002), (0.014, 0.0016), (0.008, 0.0012)
    left = OUNCES_1991
    for k in range(4):
        count = min(12, left)
        left -= count
        z = 0.0
        for _ in range(count):
            z = coin(-PILE_U + (k - 1.5) * 0.043, PILE_V + 0.115, z, *ounce, metal, rng)
    assert left == 0
    # 2.7 ounces: two coins of one ounce, one of a half, two of a tenth.
    z = coin(PILE_U - 0.04, PILE_V + 0.115, 0.0, *ounce, metal, rng)
    coin(PILE_U - 0.04, PILE_V + 0.115, z, *ounce, metal, rng)
    coin(PILE_U + 0.004, PILE_V + 0.118, 0.0, *half, metal)
    coin(PILE_U + 0.035, PILE_V + 0.108, 0.0, *tenth, metal)
    coin(PILE_U + 0.052, PILE_V + 0.126, 0.0, *tenth, metal)


def banknote(scene, tear=1.0):
    # One 100-euro note; the state's share is a strip torn off its left.
    image = bpy.data.images.load(NOTE_PICTURE)
    a = TABLE_A
    up = Vector((-math.cos(a), -math.sin(a), 0))
    share = STATE_SHARE
    rest = sheet("note-rest", (NOTE_W * (1 - share), NOTE_H), on_table(NOTE_W * share / 2, 0, 0.0004), TANGENT, up, textured("note-rest", image))
    strip = sheet("note-strip", (NOTE_W * share, NOTE_H), on_table(0, 0, 0.0004), TANGENT, up, textured("note-strip", image, (1.0, 0.16, 0.1), 0.9))
    for obj, u0, u1 in ((rest, share, 1.0), (strip, 0.0, share)):
        for loop in obj.data.uv_layers.active.data:
            loop.uv.x = u0 + loop.uv.x * (u1 - u0)
    tear_strip(strip, tear)
    return strip


def tear_strip(strip, tear):
    # From its place in the note to lying beside it, a little turned.
    u = -NOTE_W * (1 - STATE_SHARE) / 2 - tear * 0.016
    strip.location = on_table(u, tear * 0.003, 0.0004 + tear * 0.0002)
    a = TABLE_A + tear * math.radians(-9)
    x = Vector((-math.sin(a), math.cos(a), 0))
    y = Vector((-math.cos(a), -math.sin(a), 0))
    from mathutils import Matrix

    strip.rotation_quaternion = Matrix((x, y, x.cross(y))).transposed().to_quaternion()


def notice(scene, lang=None):
    # A notice on the table, its reason blacked out. The lines run along
    # the tangent, its top towards the tower: readable from where the
    # camera comes down. Only a still carries the word before the bar.
    a = TABLE_A
    page = paper("sheet", (0.86, 0.85, 0.81))
    ink = material("ink", (0.05, 0.05, 0.055), 0.6)
    faint = material("faint", (0.42, 0.42, 0.42), 0.7)
    black = material("black", (0.004, 0.004, 0.005), 0.35)
    z = TABLE_Z + 0.001
    box("notice", (0.297, 0.21, 0.002), TABLE_AT + Vector((0, 0, z)), a, page)

    def on(u, v):
        # u from the left edge, v from the top edge, in metres.
        return TABLE_AT + TANGENT * (u - 0.105) + RADIAL * (v - 0.1485) + Vector((0, 0, z + 0.002))

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


PAGE_W, PAGE_H = 0.21, 0.297


def page_slots():
    # Where a page can hang in the crypto cell: on the outer wall and on
    # both walls to its neighbours, nine rows high, leaving out what the
    # cot would hide. Ordered outwards from eye height on the outer wall,
    # so the first directive hangs in the middle and the rest grows around.
    up = Vector((0, 0, 1))
    slots = []
    rows = [0.2 + PAGE_H / 2 + k * 0.305 for k in range(9)]
    half = math.radians(22.5)
    cols = 33
    for c in range(cols):
        off = (c - (cols - 1) / 2) * 0.222
        a = A_YOU + off / (R_OUT - 0.01)
        normal = -polar(a, 1)
        for z in rows:
            if abs(off) < 1.15 and z < 0.6:
                continue
            slots.append((polar(a, R_OUT - 0.008, z), normal, off, z))
    edge = (cols / 2) * 0.222 + 0.1
    for side in (-1, 1):
        a = A_YOU + side * half
        normal = Vector((-math.sin(a), math.cos(a), 0)) * -side
        for c in range(13):
            r = R_OUT - 0.14 - c * 0.222
            for z in rows:
                slots.append((polar(a, r, z) + normal * 0.128, normal, side * (edge + c * 0.222), z))
    slots.sort(key=lambda s: math.hypot(s[2], (s[3] - 1.6) * 1.2))
    assert len(slots) >= PAGES, len(slots)
    return [(at, normal) for at, normal, _, _ in slots[:PAGES]]


def pages(scene, count, glow=True):
    # One sheet per page of the Official Journal, the first directive's red.
    image = page_image()
    white = textured("page", image, (1, 1, 1), 0.55 if glow else 0.0, 0.8)
    red = textured("page-first", image, (1.0, 0.13, 0.08), 1.5 if glow else 0.0, 0.8)
    up = Vector((0, 0, 1))
    made = []
    for k, (at, normal) in enumerate(page_slots()[:count]):
        obj = sheet("page", (PAGE_W, PAGE_H), at, up.cross(normal), up, red if k < PAGES_1991 else white)
        made.append((obj, at.copy(), normal))
    return made


def slip_points():
    # One slip per suspicion report, spread over the yard.
    rng = random.Random(REPORTS)
    r0, r1 = 1.98, 6.6
    pitch = math.sqrt(math.pi * (r1 * r1 - r0 * r0) / REPORTS / 0.866) * 0.985
    pts = []
    rows = int(r1 / (pitch * 0.866)) + 2
    for j in range(-rows, rows + 1):
        y = j * pitch * 0.866
        for i in range(-rows - 2, rows + 3):
            x = (i + (0.5 if j % 2 else 0.0)) * pitch
            if r0 <= math.hypot(x, y) <= r1:
                pts.append((x + rng.uniform(-0.22, 0.22) * pitch, y + rng.uniform(-0.22, 0.22) * pitch))
    assert len(pts) >= REPORTS, len(pts)
    rng.shuffle(pts)
    return pts[:REPORTS]


def slip_mesh(name, pts, rng, z, mats):
    verts, faces = [], []
    for x, y in pts:
        turn = rng.uniform(0, math.pi)
        c, s = math.cos(turn), math.sin(turn)
        h = z + rng.uniform(0, 0.006)
        for du, dv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
            du, dv = du * 0.039, dv * 0.027
            verts.append((x + du * c - dv * s, y + du * s + dv * c, h))
        n = len(verts)
        faces.append((n - 4, n - 3, n - 2, n - 1))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    for mat in mats:
        mesh.materials.append(mat)
    return obj


FALL_GROUPS = 6


def reports(scene, state, fall=False):
    # The year's reports in the yard: all of them, then those not passed on
    # gone pale, the rest in front of the camera, then the convictions as a
    # red patch of the same slips on a cleared spot.
    bright = paper("slip", (0.85, 0.86, 0.84), emit=(0.9, 0.94, 1.0), strength=0.55)
    pale = material("slip-kept", (0.075, 0.085, 0.105), 0.9)
    pts = slip_points()
    rng = random.Random(7)
    kept_mat = bright if state == "all" else pale
    passed_mat = pale if state == "convictions" else bright
    obj = slip_mesh("slips", pts, rng, 0.05, [passed_mat, kept_mat])
    front = lambda p: abs(math.atan2(p[1], p[0]) + math.pi / 2) if p[1] < 0 or p[0] != 0 else math.pi
    order = sorted(range(REPORTS), key=lambda k: min(front(pts[k]), 2 * math.pi - front(pts[k])))
    kept = set(order[REPORTS - REPORTS_KEPT :])
    obj.data.polygons.foreach_set("material_index", [1 if k in kept else 0 for k in range(REPORTS)])
    made = {"slips": obj}
    if state == "convictions":
        red = paper("slip-red", (0.8, 0.1, 0.07), emit=(1.0, 0.1, 0.05), strength=3.0)
        dark = material("cleared", (0.006, 0.006, 0.008), 0.95)
        bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=0.88, depth=0.012, location=PATCH_AT + Vector((0, 0, 0.066)))
        bpy.context.active_object.data.materials.append(dark)
        pitch = math.sqrt(math.pi * (6.6**2 - 1.98**2) / REPORTS / 0.866)
        spots = []
        for j in range(-9, 10):
            for i in range(-9, 10):
                x, y = (i + (0.5 if j % 2 else 0.0)) * pitch, j * pitch * 0.866
                spots.append((math.hypot(x, y), x, y))
        spots.sort()
        patch = [(PATCH_AT.x + x, PATCH_AT.y + y) for _, x, y in spots[:CONVICTIONS]]
        slip_mesh("convictions", patch, rng, 0.078, [red])
    if fall:
        # Each slip starts high above the yard, turned in the air; six
        # groups come down one after the other.
        basis = obj.shape_key_add(name="Basis")
        groups = [rng.randrange(FALL_GROUPS) for _ in range(REPORTS)]
        co = [0.0] * (REPORTS * 12)
        obj.data.vertices.foreach_get("co", co)
        made["fall"] = []
        for g in range(FALL_GROUPS):
            block = obj.shape_key_add(name=f"fall{g}")
            up = list(co)
            for k in range(REPORTS):
                if groups[k] != g:
                    continue
                dx, dy, dz = rng.uniform(-1.2, 1.2), rng.uniform(-1.2, 1.2), rng.uniform(30, 44)
                tilt = rng.uniform(-1.2, 1.2)
                cx = sum(co[(k * 4 + c) * 3] for c in range(4)) / 4
                for c in range(4):
                    i = (k * 4 + c) * 3
                    lift = (co[i] - cx) * math.tan(tilt)
                    up[i] += dx
                    up[i + 1] += dy
                    up[i + 2] += dz + lift
            block.data.foreach_set("co", up)
            block.value = 1.0
            made["fall"].append(block)
    return made


def breach(scene, shaft):
    # A ragged hole at the foot of the tower, on the crypto cell's side,
    # and light from inside it.
    rng = random.Random(8)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1.0, location=polar(A_YOU, R_TOWER - 0.1, 0.75))
    hole = bpy.context.active_object
    for v in hole.data.vertices:
        v.co *= 0.7 + rng.random() * 0.6
    hole.rotation_euler[2] = A_YOU
    hole.scale = (0.8, 1.25, 0.95)
    mod = shaft.modifiers.new("breach", "BOOLEAN")
    mod.operation = "DIFFERENCE"
    mod.object = hole
    hole.hide_render = True
    hole.hide_viewport = True
    return light(scene, "POINT", "inside", 5, polar(A_YOU, R_TOWER - 0.6, 0.7), (1.0, 0.8, 0.55), size=0.2)


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
    made = []
    for k, (at, authority, turn, t) in enumerate(sheet_points()):
        # Laid one over the other like fallen paper, each a little higher.
        leaf = box("leaf", (0.5, 0.35, 0.012), at + Vector((0, 0, k * 0.004)), turn, red if authority else plain)
        if t < 0.16:
            leaf.rotation_euler[0] = rng.uniform(-0.9, 0.9)
            leaf.rotation_euler[1] = rng.uniform(-0.7, 0.7)
        made.append(leaf)
    return made


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
    # Returns what stands there, pallet by pallet, for the clips to drop.
    wood = material("pallet", (0.3, 0.22, 0.14), 0.8)
    grey = notes_material("notes", (0.62, 0.66, 0.6))
    red = notes_material("notes-benefit", (0.78, 0.2, 0.16))
    ghost = material("ghost", (0, 0, 0), emit=(0.75, 0.82, 1.0), strength=2.4)
    cost, measured, modelled = pallet_groups()
    w, d, h = PALLET
    made = {"cost": [], "measured": [], "modelled": []}

    def stack(slot, mat, share=1.0):
        r, a = slot
        return [
            box("palletwood", (d, w, 0.144), polar(a, r, 0.072 + 0.04), a, wood),
            box("palletnotes", (d * 0.97, w * 0.98, h * share), polar(a, r, 0.184 + h * share / 2), a, mat),
        ]

    for n, slot in enumerate(cost):
        made["cost"].append(stack(slot, grey, 1.0 if n < int(COST_PALLETS) else COST_PALLETS % 1))
    if not benefit:
        return made
    for slot in measured:
        made["measured"].append(stack(slot, red))
    for r, a in modelled:
        frame = box("ghost", (d, w, h + 0.144), polar(a, r, 0.04 + (h + 0.144) / 2), a, ghost)
        mod = frame.modifiers.new("wire", "WIREFRAME")
        mod.thickness = 0.035
        made["modelled"].append(frame)
    return made


def yard_light(scene):
    # A work light over the yard, so paper and notes read at night.
    lamp = light(scene, "AREA", "work", 2600, (0, -3, 13), (0.9, 0.93, 1.0), target=(0, 0, 0), size=9)
    lamp.visible_camera = False
    return lamp


# The world as it stands at each point of the film. The table's lamp is
# always on; the searchlights are off before the rules, on in every cell
# but cash's until 2027, and on everywhere after.
STAGES = {
    "cash": dict(lights="off", table="cash"),
    "gold": dict(lights="off", table="gold"),
    "wall6": dict(lights="2026", paper=PAGES_1991),
    "wall": dict(lights="2026", paper=PAGES),
    "reports": dict(lights="2026", paper=PAGES, slips="all", work=True),
    "kept": dict(lights="2026", paper=PAGES, slips="kept", work=True),
    "convictions": dict(lights="2026", paper=PAGES, slips="convictions", work=True),
    "result": dict(lights="2026", paper=PAGES, slips="convictions", work=True, table="note"),
    "note": dict(lights="2026", paper=PAGES, table="note"),
    "pullback": dict(lights="all", paper=PAGES, table="letter", sites=True, inside=False),
    "field": dict(lights="all", paper=PAGES, table="letter", sites=True),
    "leak": dict(lights="all", paper=PAGES, table="letter", leak=True),
    "letter": dict(lights="all", paper=PAGES, table="letter"),
    "yard-cost": dict(lights="all", paper=PAGES, table="letter", stacks="cost", work=True),
    "yard": dict(lights="all", paper=PAGES, table="letter", stacks="benefit", work=True),
}


def stage(scene, name, lang=None, fall=False, tear=1.0):
    spec = dict(lights="all", table=None, paper=0, slips=None, leak=False, stacks=None, sites=False, work=False, inside=True)
    spec.update(STAGES[name])
    windows = build(scene)
    made = {}
    furniture(scene, 20 if spec["lights"] == "off" else 9)
    if spec["table"] in ("cash", "gold"):
        cash(scene, spec["table"] == "gold")
    if spec["table"] == "note":
        made["strip"] = banknote(scene, tear)
    if spec["table"] == "letter":
        notice(scene, lang)
    if spec["paper"]:
        made["pages"] = pages(scene, spec["paper"])
    if spec["slips"]:
        made.update(reports(scene, spec["slips"], fall))
    if spec["leak"]:
        shaft = next(o for o in scene.objects if o.type == "MESH" and abs(o.dimensions.z - 4.6) < 0.01)
        made["flash"] = breach(scene, shaft)
        made["sheets"] = spill(scene)
    if spec["stacks"]:
        made.update(pallets(scene, spec["stacks"] == "benefit"))
    if spec["work"]:
        made["work"] = yard_light(scene)
    skip = (CASH,) if spec["lights"] == "2026" else ()
    if spec["lights"] == "off":
        pass
    elif spec["sites"]:
        lit(scene, windows, haze=False)
        field(scene)
        # The haze of our own searchlights, which the other sites do without.
        for obj in lit(scene, [], haze=True, inside=spec["inside"]):
            bpy.data.objects.remove(obj)
        if spec["inside"]:
            # Seen from inside, our own cell glows less than the others.
            you = bpy.data.objects[f"cell{YOU}"]
            you.data = you.data.copy()
            you.data.energy = 50
    else:
        lit(scene, windows, inside=True, skip=skip)
        if skip:
            # Eight of the nine authorities until 2026 came in; all nine by then.
            pass
    night(scene)
    return made


# The stills: the camera's key and the stage it stands in.
STILLS = {
    "cash": ("cash", "cash"),
    "gold": ("cash", "gold"),
    "cent": ("cent", "gold"),
    "wall6": ("wall6", "wall6"),
    "wall": ("wall", "wall"),
    "reports": ("yard", "reports"),
    "kept": ("yard", "kept"),
    "convictions": ("yard", "convictions"),
    "note": ("note", "note"),
    "wide": ("wide", "pullback"),
    "cell": ("cell", "field"),
    "leak": ("leak", "leak"),
    "letter-de": ("letter", "letter"),
    "letter-en": ("letter", "letter"),
    "yard-cost": ("yard", "yard-cost"),
    "yard-benefit": ("yard", "yard"),
    "horn": ("horn", "yard"),
}


def still(name, path):
    scene = reset()
    key, stage_name = STILLS[name]
    stage(scene, stage_name, lang=name[-2:] if name.startswith("letter") else None)
    camera_key(scene, KEYS[key])
    scene.render.film_transparent = False
    render(scene, path)


def overview_world(scene, late, lamp, glow=True):
    # What stands in the overview's passes: the table with the money on
    # it, and later the note and the pages on the cell's walls.
    windows = build(scene)
    furniture(scene, (9 if late else 20) if lamp else 0)
    if late:
        banknote(scene)
        pages(scene, PAGES, glow)
    else:
        cash(scene, True)
    return windows


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


# ---------- The clips: the camera's way from one still to the next -----------
# and what happens in the world on the way. Each is rendered as frames
# with motion blur and plays once when its step comes up.


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)


def keep(obj, frame):
    obj.keyframe_insert("location", frame=frame)
    if obj.rotation_mode == "QUATERNION":
        obj.keyframe_insert("rotation_quaternion", frame=frame)
    else:
        obj.keyframe_insert("rotation_euler", frame=frame)
    obj.keyframe_insert("scale", frame=frame)


def power(lamp, frames):
    for frame, energy in frames:
        lamp.data.energy = energy
        lamp.data.keyframe_insert("energy", frame=frame)


def act_paper(made, n):
    # The pages since 1991 fly on to the walls, block by block as adopted.
    up = Vector((0, 0, 1))
    rng = random.Random(488)
    later = made["pages"][PAGES_1991:]
    for k, (obj, at, normal) in enumerate(later):
        start = round(n * (0.1 + 0.68 * (k / len(later)) ** 0.85))
        size = obj.scale.copy()
        side = up.cross(normal) * rng.uniform(-0.5, 0.5)
        away = at + normal * rng.uniform(0.7, 1.3) + side + up * rng.uniform(-0.2, 0.5)
        obj.scale = (0, 0, 0)
        obj.location = away
        keep(obj, start - 1)
        for f in range(9):
            t = ease(f / 8)
            obj.location = away.lerp(at, t)
            obj.scale = size * (0.35 + 0.65 * t)
            keep(obj, start + f)


def act_rain(made, n):
    # The work light comes on and the year's reports rain into the yard.
    power(made["work"], [(round(n * 0.2), 0), (round(n * 0.5), 2600)])
    for g, block in enumerate(made["fall"]):
        start = n * (0.36 + 0.05 * g)
        for frame, value in ((round(start), 1.0), (round(start + n * 0.3), 0.0)):
            block.value = value
            block.keyframe_insert("value", frame=frame)


def act_tear(made, n):
    # The yard's light goes out; at the table the state's strip comes off.
    power(made["work"], [(round(n * 0.3), 2600), (round(n * 0.6), 0)])
    strip = made["strip"]
    for f in range(round(n * 0.72), n):
        tear_strip(strip, ease((f - n * 0.72) / (n * 0.24)))
        keep(strip, f)


def act_burst(made, n):
    # A flash inside the tower, and the sheets fly out of the breach.
    power(made["flash"], [(0, 0), (3, 900), (7, 300), (20, 5)])
    origin = polar(A_YOU, R_TOWER + 0.15, 0.8)
    rng = random.Random(38)
    order = list(range(LEAKS))
    rng.shuffle(order)
    for rank, k in enumerate(order):
        leaf = made["sheets"][k]
        at, turn, size = leaf.location.copy(), leaf.rotation_euler.copy(), leaf.scale.copy()
        start = 3 + round(n * 0.42 * rank / LEAKS)
        span = round(n * 0.3)
        height = rng.uniform(0.8, 2.2)
        spin = Vector((rng.uniform(-6, 6), rng.uniform(-6, 6), rng.uniform(-4, 4)))
        leaf.scale = (0, 0, 0)
        leaf.location = origin
        keep(leaf, start - 1)
        for f in range(span + 1):
            t = f / span
            g = 1 - (1 - t) ** 2
            leaf.location = origin.lerp(at, g) + Vector((0, 0, 4 * height * t * (1 - t)))
            leaf.rotation_euler = [turn[i] + spin[i] * (1 - g) for i in range(3)]
            leaf.scale = size * min(1.0, 0.3 + t * 3)
            keep(leaf, start + f)


def drop(parts, start, span=11, height=16.0):
    # A pallet comes down from above and stands.
    places = [p.location.copy() for p in parts]
    for p, at in zip(parts, places):
        p.location = at + Vector((0, 0, height))
        keep(p, start - 1)
    for f in range(span + 1):
        t = f / span
        for p, at in zip(parts, places):
            p.location = at + Vector((0, 0, height * (1 - t * t)))
            keep(p, start + f)


def act_cost(made, n):
    power(made["work"], [(round(n * 0.25), 0), (round(n * 0.55), 2600)])
    for k, parts in enumerate(made["cost"]):
        drop(parts, round(n * (0.5 + 0.34 * k / len(made["cost"]))))


def act_benefit(made, n):
    # The cost stands; the benefit measured drops beside it, then the
    # benefit from the model appears as outlines, front to back.
    for k, parts in enumerate(made["measured"]):
        drop(parts, round(n * (0.06 + 0.36 * k / len(made["measured"]))))
    for k, frame in enumerate(made["modelled"]):
        start = round(n * (0.5 + 0.38 * k / len(made["modelled"])))
        size = frame.scale.copy()
        frame.scale = (0, 0, 0)
        keep(frame, start - 1)
        for f in range(6):
            frame.scale = size * ease((f + 1) / 6)
            keep(frame, start + f)


CLIPS = {
    "cent": dict(stage="gold", keys=["cash", "cent"], frames=60),
    "rise": dict(stage="gold", keys=["cent", "table", "rise", "overview"], frames=96),
    "wall": dict(stage="wall6", keys=["overview", "hover", "wall", "hop", "wall6"], frames=96),
    "paper": dict(stage="wall", keys=["wall6", "hop", "wall"], frames=96, act=act_paper),
    "reports": dict(stage="reports", keys=["wall", "hover", "yard"], frames=108, act=act_rain, fall=True),
    "note": dict(stage="result", keys=["yard", "rise", "table", "note"], frames=96, act=act_tear),
    "back": dict(stage="note", keys=["note", "table", "rise", "overview"], frames=84),
    "wide": dict(stage="pullback", keys=["overview", "wide"], frames=72),
    "cell": dict(stage="field", keys=["wide", "over", "cell"], frames=96),
    "leak": dict(stage="leak", keys=["cell", "lift", "leak"], frames=84, act=act_burst),
    "letter": dict(stage="leak", keys=["leak", "table", "letter"], frames=72),
    "yard": dict(stage="yard-cost", keys=["letter", "table", "rise", "yard"], frames=108, act=act_cost),
    "benefit": dict(stage="yard", keys=["yard", "yard"], frames=72, act=act_benefit),
    "horn": dict(stage="yard", keys=["yard", "horn"], frames=72),
}
CLIP_SIZE = (1120, 1008)


def blocked(p):
    # Whether a camera position lies inside something built.
    r, z = math.hypot(p.x, p.y), p.z
    if z < 0.06:
        return "ground"
    if r < R_TOWER + 0.15 and z < 4.75:
        return "tower"
    if r < R_LANTERN + 0.3 and 4.45 < z < 7.4:
        return "lantern"
    if z < WALL_H + 0.08 and (R_IN - 0.3 < r < R_IN + 0.08 or R_OUT - 0.04 < r < R_OUT + 0.53):
        return "ring wall"
    if z < WALL_H + 0.08 and R_IN < r < R_OUT:
        a = math.atan2(p.y, p.x)
        for k in range(CELLS):
            d = (a - ANGLES[k] - math.radians(22.5) + math.pi) % (2 * math.pi) - math.pi
            if abs(d) * r < 0.2:
                return "divider"
    if z < TABLE_Z + 0.03 and (Vector((p.x, p.y, 0)) - TABLE_AT).length < 0.55:
        return "table"
    return None


def check():
    for name, spec in CLIPS.items():
        n = spec["frames"]
        hits = {}
        for f in range(n * 4):
            key = between(spec["keys"], f / (n * 4 - 1))
            az, el = math.radians(key["az"]), math.radians(key["el"])
            p = Vector(key["target"]) + Vector((math.cos(el) * math.cos(az), math.cos(el) * math.sin(az), math.sin(el))) * key["d"]
            hit = blocked(p)
            if hit:
                hits.setdefault(hit, []).append(round(f / 4, 1))
        print(name, "clear" if not hits else {k: (v[0], v[-1]) for k, v in hits.items()})


def clip(name, out):
    spec = CLIPS[name]
    scene = reset()
    n = int(os.environ.get("FRAMES", spec["frames"]))
    bpy.context.preferences.edit.keyframe_new_interpolation_type = "LINEAR"
    made = stage(scene, spec["stage"], fall=spec.get("fall", False), tear=0.0)
    cam = camera_key(scene, KEYS[spec["keys"][0]])
    for f in range(n):
        camera_key(scene, between(spec["keys"], f / (n - 1)), cam)
        cam.keyframe_insert("location", frame=f)
        cam.keyframe_insert("rotation_quaternion", frame=f)
        cam.data.keyframe_insert("lens", frame=f)
        cam.data.dof.keyframe_insert("focus_distance", frame=f)
        cam.data.dof.keyframe_insert("aperture_fstop", frame=f)
    if "act" in spec:
        spec["act"](made, n)
    scene.render.resolution_x, scene.render.resolution_y = CLIP_SIZE
    scene.render.use_motion_blur = True
    scene.render.motion_blur_shutter = 0.5
    scene.render.use_persistent_data = True
    scene.frame_start = int(os.environ.get("FROM", 0))
    scene.frame_end = n - 1
    scene.frame_step = int(os.environ.get("STEP", 1))
    scene.render.filepath = os.path.join(out, "")
    os.makedirs(out, exist_ok=True)
    bpy.ops.render.render(animation=True)


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
        "cash": {
            "then": project("cash", on_table(-PILE_U, PILE_V, 0.04)),
            "now": project("cash", on_table(PILE_U, PILE_V, 0.012)),
            "cent": project("cent", on_table(*CENT_AT, 0.002)),
        },
        "wide": {"home": project("wide", (0, 0, 12)), "tag": project("wide", tag)},
        "reports": {
            "kept": project("yard", polar(math.radians(168), 4.4, 0.1)),
            "passed": project("yard", polar(math.radians(-90), 3.6, 0.1)),
            "convictions": project("yard", PATCH_AT + Vector((0, 0, 0.1))),
            "all": project("yard", polar(math.radians(168), 4.4, 0.1)),
        },
        "note": {
            "state": project("note", on_table(-NOTE_W / 2 - 0.016, 0.003)),
            "rest": project("note", on_table(0.0, 0.0)),
        },
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


PASSES = (
    "points", "base", "base-late", "light6-late", "proposal", "wide-links", "wide-tags", "world", "check",
    *[f"light{k}" for k in range(CELLS)], *[f"watch{k}" for k in range(len(WATCH_ANGLES))],
    *STILLS, *[f"clip-{name}" for name in CLIPS],
)
if ONLY is not None and ONLY not in PASSES:
    raise ValueError(f"Unknown panopticon pass: {ONLY}")
os.makedirs(OUT, exist_ok=True)
if ONLY in (None, "points"):
    points(os.path.join(OUT, "panopticon.json"))
for late in (False, True):
    name = "base-late" if late else "base"
    if ONLY in (None, name):
        base(os.path.join(OUT, f"{name}.png"), late)
for k in range(CELLS):
    if ONLY in (None, f"light{k}"):
        light_pass(k, os.path.join(OUT, f"light{k}.png"))
if ONLY in (None, "light6-late"):
    light_pass(YOU, os.path.join(OUT, "light6-late.png"), late=True)
for k in range(len(WATCH_ANGLES)):
    if ONLY in (None, f"watch{k}"):
        watch_pass(k, os.path.join(OUT, f"watch{k}.png"))

# The rest is rendered only when asked for by name.
if ONLY == "proposal":
    proposal(os.path.join(OUT, "proposal.png"))
if ONLY in ("wide-links", "wide-tags"):
    wide_pass(ONLY[5:], os.path.join(OUT, f"{ONLY}.png"))
if ONLY in STILLS:
    still(ONLY, os.path.join(OUT, f"{ONLY}.png"))
if ONLY == "world":
    world_points(os.path.join(OUT, "world.json"))
if ONLY == "check":
    check()
if ONLY and ONLY.startswith("clip-"):
    clip(ONLY[5:], os.path.join(OUT, ONLY))
