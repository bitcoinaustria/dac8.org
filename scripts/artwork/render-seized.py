# Renders the film's last picture (RuleFilm.astro, ergebnis-euro): 100
# one-euro coins in ten rows of ten, from which the state takes two onto a
# red tray in front. Rendered in layers from one orthographic camera, for
# scripts/artwork/composite-seized.mjs:
#   coins:  one coin in each of five turns, apart, with its shadow; the
#           film lays out the grid from these
#   lift:   the two that the state takes, apart and without shadows; the
#           film draws their shadows as they rise
#   tray:   the empty tray
#   landed: the tray with the two on it
#   start, end: the whole picture before and after, to look at
# Usage: blender -b -noaudio -P scripts/artwork/render-seized.py -- <layer> <out.png>
# It prints SEIZED and, as JSON, where everything lies in pixels of the full
# frame; composite-seized.mjs takes that line.
# SAMPLES and PCT lower the cost of previews; CLOSE=x,y,width looks closely
# at one place (in cm). FONT is the numeral's font (a bold sans).
import json
import math
import os
import random
import sys

import bmesh
import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1 :]
layer, out = args[0], args[1]
PCT = int(os.environ.get("PCT", 100))
SAMPLES = int(os.environ.get("SAMPLES", 256))
ELEV = math.radians(float(os.environ.get("ELEV", 55)))
FONT = os.environ.get("FONT", "/usr/share/fonts/liberation/LiberationSans-Bold.ttf")

# Scene units: 1 = 1 cm. A one-euro coin is 23.25 mm across and 2.33 mm
# thick, its silver core 16.25 mm across.
D, T, CORE = 2.325, 0.233, 1.625
PITCH = 2.65
# The two taken, by row (0 in front) and column; how high they rise before
# they move; where the tray stands and how deep its floor sits.
HOLES = [(4, 4), (4, 5)]
LIFT = 1.6
TRAY_Y = -4.5 * PITCH - D / 2 - 3.4
TRAY_FLOOR = 0.12

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
# No light bounced or mirrored off the tray or the coins onto the table:
# the shadow catcher would keep it as a pale halo, dirty on a dark page.
scene.cycles.diffuse_bounces = 0
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.render.film_transparent = True
scene.render.resolution_x = 2400
scene.render.resolution_y = 2280
scene.render.resolution_percentage = PCT
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Punchy"


def metal(name, color, rough):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = 1.0
    return mat


# Circulated coins: the fields satin, the raised design and the rim
# polished by handling, so the numeral reads light on a duller ground.
brass = metal("brass", (0.84, 0.56, 0.18), 0.32)
brass_bright = metal("brass-bright", (0.98, 0.76, 0.36), 0.12)
nickel = metal("nickel", (0.55, 0.56, 0.56), 0.34)
nickel_bright = metal("nickel-bright", (0.9, 0.9, 0.89), 0.1)


def lathe(name, strips, segs=192):
    # A body turned around the z axis. Each strip is a run of (r, z)
    # points in one material, from the top's middle outwards and down;
    # strips meet at sharp edges, points within one run smoothly.
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    angles = [k / segs * math.tau for k in range(segs)]
    for mat_index, points in strips:
        rings = []
        for r, z in points:
            if r == 0:
                rings.append([bm.verts.new((0, 0, z))])
            else:
                rings.append([bm.verts.new((r * math.cos(a), r * math.sin(a), z)) for a in angles])
        for i in range(len(points) - 1):
            (r0, z0), (r1, z1) = points[i], points[i + 1]
            out_r, out_z = -(z1 - z0), r1 - r0
            a_ring, b_ring = rings[i], rings[i + 1]
            for k in range(segs):
                k1 = (k + 1) % segs
                quad = [v for v in (a_ring[k % len(a_ring)], a_ring[k1 % len(a_ring)], b_ring[k1 % len(b_ring)], b_ring[k % len(b_ring)])]
                quad = list(dict.fromkeys(quad))
                face = bm.faces.new(quad)
                face.material_index = mat_index
                face.smooth = True
                face.normal_update()
                a = angles[k] + math.pi / segs
                want = Vector((out_r * math.cos(a), out_r * math.sin(a), out_z))
                if face.normal.dot(want) < 0:
                    face.normal_flip()
    bm.to_mesh(mesh)
    bm.free()
    return mesh


def star_mesh(name, outer, inner, height):
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    ring = []
    for k in range(10):
        r = outer if k % 2 == 0 else inner
        a = math.pi / 2 + k * math.pi / 5
        ring.append(bm.verts.new((r * math.cos(a), r * math.sin(a), 0)))
    face = bm.faces.new(ring)
    bmesh.ops.extrude_face_region(bm, geom=[face])
    for v in bm.verts:
        if v not in ring:
            v.co.z = height
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    return mesh


# One coin, built once and placed a hundred times.
euro = bpy.data.collections.new("euro")
CORE_TOP, RING_TOP = 0.2, 0.19


def part(name, data, mats):
    obj = bpy.data.objects.new(name, data)
    for mat in mats:
        obj.data.materials.append(mat)
    euro.objects.link(obj)
    return obj


part(
    "body",
    lathe(
        "body",
        [
            (0, [(0, CORE_TOP), (CORE / 2 - 0.025, CORE_TOP)]),
            (1, [(CORE / 2 - 0.025, CORE_TOP), (CORE / 2, RING_TOP - 0.012)]),
            (2, [(CORE / 2, RING_TOP - 0.012), (CORE / 2 + 0.02, RING_TOP)]),
            (2, [(CORE / 2 + 0.02, RING_TOP), (D / 2 - 0.1, RING_TOP)]),
            (3, [(D / 2 - 0.1, RING_TOP), (D / 2 - 0.07, T - 0.006), (D / 2 - 0.04, T), (D / 2 - 0.012, T - 0.008), (D / 2, T - 0.03)]),
            (2, [(D / 2, T - 0.03), (D / 2, 0.03)]),
            (2, [(D / 2, 0.03), (D / 2 - 0.03, 0), (0, 0)]),
        ],
    ),
    [nickel, nickel_bright, brass, brass_bright],
)

font = bpy.data.fonts.load(FONT) if os.path.exists(FONT) else None


def relief_text(name, body, size, at, mat):
    curve = bpy.data.curves.new(name, "FONT")
    curve.body = body
    if font:
        curve.font = font
    curve.align_x = "CENTER"
    curve.align_y = "CENTER"
    curve.size = size
    curve.extrude = 0.008
    curve.bevel_depth = 0.006
    curve.bevel_resolution = 2
    obj = part(name, curve, [mat])
    obj.location = (*at, CORE_TOP + 0.01)
    return obj


# The common side as since 2007: a large 1 on the left of the core, EURO
# beside it lower down, twelve stars along the ring on the right.
relief_text("one", "1", 1.42, (-0.3, 0.02), nickel_bright)
relief_text("word", "EURO", 0.24, (0.32, -0.36), nickel_bright)
star = star_mesh("star", 0.07, 0.03, RING_TOP + 0.022)
for k in range(12):
    a = math.radians(-66 + k * 132 / 11)
    r = (CORE / 2 + D / 2 - 0.1) / 2 + 0.01
    obj = part(f"star{k}", star, [brass_bright])
    obj.location = (r * math.cos(a), r * math.sin(a), 0)
    obj.rotation_euler[2] = a - math.pi / 2


def place(name, at, turn):
    obj = bpy.data.objects.new(name, None)
    obj.instance_type = "COLLECTION"
    obj.instance_collection = euro
    obj.location = at
    obj.rotation_euler[2] = turn
    scene.collection.objects.link(obj)
    return obj


def tray():
    # A shallow tray with a rounded rim, a little wider than the two coins
    # side by side; lacquered red.
    inner_w, inner_d = PITCH + D + 0.7, D + 0.7
    wall, height, radius = 0.38, 0.42, 0.55
    mesh = bpy.data.meshes.new("tray")
    bm = bmesh.new()

    def outline(w, d, r, z, n=16):
        verts = []
        for cx, cy, start in ((w / 2 - r, d / 2 - r, 0), (-w / 2 + r, d / 2 - r, 90), (-w / 2 + r, -d / 2 + r, 180), (w / 2 - r, -d / 2 + r, 270)):
            for k in range(n + 1):
                a = math.radians(start + 90 * k / n)
                verts.append(bm.verts.new((cx + r * math.cos(a), cy + r * math.sin(a), z)))
        return verts

    bottom = outline(inner_w + 2 * wall, inner_d + 2 * wall, radius + wall, 0)
    top_out = outline(inner_w + 2 * wall, inner_d + 2 * wall, radius + wall, height)
    top_in = outline(inner_w, inner_d, radius, height)
    floor_in = outline(inner_w, inner_d, radius, TRAY_FLOOR)
    n = len(bottom)
    bm.faces.new(list(reversed(bottom)))
    for a, b in ((bottom, top_out), (top_out, top_in), (top_in, floor_in)):
        for k in range(n):
            bm.faces.new((a[k], a[(k + 1) % n], b[(k + 1) % n], b[k]))
    bm.faces.new(floor_in)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new("tray", mesh)
    bevel = obj.modifiers.new("bevel", "BEVEL")
    bevel.width = 0.08
    bevel.segments = 4
    bevel.limit_method = "ANGLE"
    obj.modifiers.new("smooth", "WEIGHTED_NORMAL")
    for poly in mesh.polygons:
        poly.use_smooth = True
    lacquer = bpy.data.materials.new("lacquer")
    lacquer.use_nodes = True
    bsdf = lacquer.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (0.78, 0.018, 0.025, 1)
    bsdf.inputs["Roughness"].default_value = 0.42
    bsdf.inputs["Coat Weight"].default_value = 0.6
    bsdf.inputs["Coat Roughness"].default_value = 0.12
    mesh.materials.append(lacquer)
    obj.location = (tray_x, TRAY_Y, 0)
    scene.collection.objects.link(obj)
    return obj


rnd = random.Random(100)
spots = {(r, c): ((c - 4.5) * PITCH, (r - 4.5) * PITCH) for r in range(10) for c in range(10)}
# Laid by hand: each coin a little turned, the numerals still upright. Five
# turns, rendered once each and placed by the film, one per place.
TURNS = [-0.16, -0.08, 0.0, 0.08, 0.16]
kinds = {key: rnd.randrange(len(TURNS)) for key in spots}
alone = [((k - 2) * 5.0, 0.0) for k in range(len(TURNS))]
tray_x = sum(spots[key][0] for key in HOLES) / len(HOLES)

if layer == "coins":
    for k, at in enumerate(alone):
        place(f"c{k}", (*at, 0), TURNS[k])
if layer == "lift":
    for k, key in enumerate(HOLES):
        place(f"c{k}", (*alone[k], 0), TURNS[kinds[key]])
if layer in ("start", "end", "close"):
    for key, (x, y) in spots.items():
        if key not in HOLES or layer != "end":
            place(f"e{key[0]}-{key[1]}", (x, y, 0), TURNS[kinds[key]])
if layer in ("tray", "landed", "start", "end"):
    tray()
if layer in ("landed", "end"):
    for key in HOLES:
        place(f"l{key[1]}", (spots[key][0], TRAY_Y, TRAY_FLOOR), TURNS[kinds[key]])

# Shadow catcher on the table. Under the two that rise it stays for what
# their rims mirror, but leaves out their shadows: the film draws those.
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, 0))
floor = bpy.context.active_object
floor.is_shadow_catcher = True
if layer == "lift":
    floor.visible_camera = False

# Light: a studio picture for what the metal mirrors, a broad softbox
# where the coins' faces mirror the camera, and a soft key from behind on
# the left that throws the shadows forward and right.
world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
nt = world.node_tree
env = nt.nodes.new("ShaderNodeTexEnvironment")
studio = os.path.join(bpy.utils.system_resource("DATAFILES"), "studiolights", "world", "studio.exr")
env.image = bpy.data.images.load(studio)
mapping = nt.nodes.new("ShaderNodeMapping")
mapping.inputs["Rotation"].default_value = (0, 0, math.radians(float(os.environ.get("TURN", 0))))
coord = nt.nodes.new("ShaderNodeTexCoord")
nt.links.new(coord.outputs["Generated"], mapping.inputs["Vector"])
nt.links.new(mapping.outputs["Vector"], env.inputs["Vector"])
studio_light = nt.nodes.new("ShaderNodeBackground")
studio_light.inputs["Strength"].default_value = float(os.environ.get("WORLD", 0.5))
nt.links.new(env.outputs["Color"], studio_light.inputs["Color"])
# What is not a mirror sees an even grey, so the table only gets the key's
# shadow and a soft one all around, none from the studio's lamps.
grey = nt.nodes["Background"]
grey.inputs["Color"].default_value = (0.5, 0.5, 0.5, 1)
grey.inputs["Strength"].default_value = 0.5
path = nt.nodes.new("ShaderNodeLightPath")
mix = nt.nodes.new("ShaderNodeMixShader")
nt.links.new(path.outputs["Is Glossy Ray"], mix.inputs["Fac"])
nt.links.new(grey.outputs["Background"], mix.inputs[1])
nt.links.new(studio_light.outputs["Background"], mix.inputs[2])
nt.links.new(mix.outputs["Shader"], nt.nodes["World Output"].inputs["Surface"])

mirror = Vector((0, math.cos(ELEV), math.sin(ELEV)))
bpy.ops.mesh.primitive_plane_add(size=1, location=mirror * 60)
box = bpy.context.active_object
box.scale = (40, 26, 1)
box.rotation_euler = (-box.location).to_track_quat("Z", "Y").to_euler()
for ray in ("camera", "diffuse", "shadow", "transmission", "volume_scatter"):
    setattr(box, f"visible_{ray}", False)
glow = bpy.data.materials.new("softbox")
glow.use_nodes = True
gnt = glow.node_tree
gnt.nodes.remove(gnt.nodes["Principled BSDF"])
emit = gnt.nodes.new("ShaderNodeEmission")
falloff = gnt.nodes.new("ShaderNodeTexGradient")
falloff.gradient_type = "SPHERICAL"
gcoord = gnt.nodes.new("ShaderNodeTexCoord")
strength = gnt.nodes.new("ShaderNodeMath")
strength.operation = "MULTIPLY"
strength.inputs[1].default_value = float(os.environ.get("BOX", 2.2))
gnt.links.new(gcoord.outputs["Object"], falloff.inputs["Vector"])
gnt.links.new(falloff.outputs["Fac"], strength.inputs[0])
gnt.links.new(strength.outputs[0], emit.inputs["Strength"])
emit.inputs["Color"].default_value = (1.0, 0.97, 0.92, 1)
gnt.links.new(emit.outputs["Emission"], gnt.nodes["Material Output"].inputs["Surface"])
box.data.materials.append(glow)

key_dir = Vector((-0.42, 0.5, 1.0)).normalized()
key_data = bpy.data.lights.new("key", "AREA")
key_data.energy = float(os.environ.get("KEY", 60000))
key_data.size = 22
key_data.color = (1.0, 0.96, 0.9)
key = bpy.data.objects.new("key", key_data)
key.location = key_dir * 80
key.rotation_euler = (-key.location).to_track_quat("-Z", "Y").to_euler()
# The coins mirror the softbox alone, alike across the grid.
key.visible_glossy = False
scene.collection.objects.link(key)

# The camera looks from the front, ELEV above the table, onto the middle
# between the grid and the tray.
cam = bpy.data.cameras.new("cam")
cam.type = "ORTHO"
cam.ortho_scale = float(os.environ.get("SIZE", 30))
cam_obj = bpy.data.objects.new("cam", cam)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj
aim = Vector((0, (4.5 * PITCH + D / 2 + TRAY_Y - 1.9) / 2, 0))
cam_obj.location = aim + Vector((0, -math.cos(ELEV), math.sin(ELEV))) * 60
cam_obj.rotation_euler = (aim - cam_obj.location).to_track_quat("-Z", "Y").to_euler()
if os.environ.get("CLOSE"):
    cx, cy, size = (float(v) for v in os.environ["CLOSE"].split(","))
    cam.ortho_scale = size
    cam_obj.location += Vector((cx, cy - aim.y, 0))
    scene.render.resolution_y = 2400

bpy.context.view_layer.update()
width, height = scene.render.resolution_x, scene.render.resolution_y


def pixel(p):
    v = world_to_camera_view(scene, cam_obj, Vector(p))
    return [round(v.x * width, 1), round((1 - v.y) * height, 1)]


def minus(a, b):
    return [round(p - q, 1) for p, q in zip(a, b)]


# Where things are, in pixels of the full frame: each coin alone, where it
# touches the table; the grid's front left coin and the step to the next column and row; the
# way of the first of the two from its place, lifted, over the tray and
# into it (the second moves alike); and how far the shadow of a lifted
# coin falls from it, along the key light.
x0, y0 = spots[HOLES[0]]
up = Vector((x0, y0, LIFT))
fall = up - key_dir * (LIFT / key_dir.z)
start = pixel((x0, y0, 0))
print(
    "SEIZED",
    json.dumps(
        {
            "alone": [pixel((*at, 0)) for at in alone],
            "origin": pixel((*spots[(0, 0)], 0)),
            "column": minus(pixel((PITCH, 0, 0)), pixel((0, 0, 0))),
            "row": minus(pixel((0, PITCH, 0)), pixel((0, 0, 0))),
            "kinds": [[kinds[(r, c)] for c in range(10)] for r in range(10)],
            "holes": HOLES,
            "up": minus(pixel(up), start),
            "over": minus(pixel((x0, TRAY_Y, TRAY_FLOOR + LIFT)), start),
            "landed": minus(pixel((x0, TRAY_Y, TRAY_FLOOR)), start),
            "shadow": minus(pixel(fall), pixel(up)),
        }
    ),
)
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
