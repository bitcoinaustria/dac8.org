# Renders the film's last picture (RuleFilm.astro, ergebnis-euro): 100
# euros as one stack of fifty two-euro coins, from which the state takes the
# top coin onto a red tray beside it. Rendered in layers from one
# orthographic camera, for scripts/artwork/composite-seized.mjs:
#   coin:   one coin alone, without shadow; the film stacks it fifty
#           times and moves the top one, drawing its shadow as it goes
#   shadow: the stack's shadow alone, the coins themselves left out
#   tray:   the empty tray
#   landed: the tray with the coin on it
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
ELEV = math.radians(float(os.environ.get("ELEV", 30)))
FONT = os.environ.get("FONT", "/usr/share/fonts/liberation/LiberationSans-Bold.ttf")

# Scene units: 1 = 1 cm. A two-euro coin is 25.75 mm across and 2.2 mm
# thick, its golden core 18.75 mm across.
D, T, CORE = 2.575, 0.22, 1.875
# Fifty of them make 100 euros; the state takes the top one.
COUNT, VALUE, TAKEN = 50, 2, 1
# Where the tray stands, right of the stack and in front, and how
# deep its floor sits; how high the coin rises before it moves.
TRAY_AT = (float(os.environ.get("TRAY_X", 4.6)), float(os.environ.get("TRAY_Y", -1.6)))
TRAY_FLOOR = 0.12
LIFT = 1.0

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


def reeded(name, color, rough, reeds):
    # The edge, finely milled: a ripple around the coin, as bump.
    mat = metal(name, color, rough)
    nt = mat.node_tree
    coord = nt.nodes.new("ShaderNodeTexCoord")
    xyz = nt.nodes.new("ShaderNodeSeparateXYZ")
    angle = nt.nodes.new("ShaderNodeMath")
    angle.operation = "ARCTAN2"
    times = nt.nodes.new("ShaderNodeMath")
    times.operation = "MULTIPLY"
    times.inputs[1].default_value = reeds
    wave = nt.nodes.new("ShaderNodeMath")
    wave.operation = "SINE"
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = float(os.environ.get("REED", 0.35))
    bump.inputs["Distance"].default_value = 0.004
    nt.links.new(coord.outputs["Object"], xyz.inputs[0])
    nt.links.new(xyz.outputs["Y"], angle.inputs[0])
    nt.links.new(xyz.outputs["X"], angle.inputs[1])
    nt.links.new(angle.outputs[0], times.inputs[0])
    nt.links.new(times.outputs[0], wave.inputs[0])
    nt.links.new(wave.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])
    return mat


edge = reeded("edge", (0.68, 0.69, 0.69), 0.36, 120)


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


# One coin, built once and placed fifty times: a silver ring around a
# golden core, the core standing a little proud.
euro = bpy.data.collections.new("euro")
CORE_TOP, RING_TOP = 0.19, 0.18


def part(name, data, mats):
    obj = bpy.data.objects.new(name, data)
    for mat in mats:
        obj.data.materials.append(mat)
    euro.objects.link(obj)
    return obj


body = part(
    "body",
    lathe(
        "body",
        [
            (0, [(0, CORE_TOP), (CORE / 2 - 0.025, CORE_TOP)]),
            (1, [(CORE / 2 - 0.025, CORE_TOP), (CORE / 2, RING_TOP - 0.012)]),
            (2, [(CORE / 2, RING_TOP - 0.012), (CORE / 2 + 0.02, RING_TOP)]),
            (2, [(CORE / 2 + 0.02, RING_TOP), (D / 2 - 0.1, RING_TOP)]),
            (3, [(D / 2 - 0.1, RING_TOP), (D / 2 - 0.07, T - 0.006), (D / 2 - 0.04, T), (D / 2 - 0.012, T - 0.008), (D / 2, T - 0.03)]),
            (4, [(D / 2, T - 0.03), (D / 2, 0.03)]),
            (3, [(D / 2, 0.03), (D / 2 - 0.03, 0), (0, 0)]),
        ],
    ),
    [brass, brass_bright, nickel, nickel_bright, edge],
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


# The common side as since 2007: a large 2 on the left of the core, EURO
# beside it lower down, twelve stars along the ring on the right.
relief_text("two", "2", 1.62, (-0.34, 0.02), brass_bright)
relief_text("word", "EURO", 0.27, (0.37, -0.41), brass_bright)
star = star_mesh("star", 0.075, 0.032, RING_TOP + 0.022)
for k in range(12):
    a = math.radians(-66 + k * 132 / 11)
    r = (CORE / 2 + D / 2 - 0.1) / 2 + 0.01
    obj = part(f"star{k}", star, [nickel_bright])
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
    # A shallow tray with a rounded rim, a little wider than one coin;
    # lacquered red.
    inner_w, inner_d = D + 1.1, D + 0.8
    wall, height, radius = 0.36, 0.4, 0.6
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
    obj.location = (*TRAY_AT, 0)
    # The coins do not mirror it, or the stack would blush on one side.
    obj.visible_glossy = False
    scene.collection.objects.link(obj)
    return obj


# Stacked by hand: each coin a hair off the one below. The film places one
# picture of the coin at every height, so they all share one turn, the top
# one's numeral a little tilted.
TURN = 0.14
rnd = random.Random(50)
drift = [(0.0, 0.0)] + [(max(-0.05, min(0.05, rnd.gauss(0, 0.02))), max(-0.05, min(0.05, rnd.gauss(0, 0.02)))) for _ in range(COUNT - 1)]
stack = [(x, y, k * T) for k, (x, y) in enumerate(drift)]
top = stack[-1]
landed = (*TRAY_AT, TRAY_FLOOR)

# The film's coin, alone without shadow. A neighbour the camera does not
# see lies under it, so its rim mirrors a coin as in the stack, not the
# table far below.
if layer in ("coin", "close"):
    place("coin", top, TURN)
    under = bpy.data.objects.new("under", body.data)
    under.location = (top[0], top[1], top[2] - T)
    under.visible_camera = False
    scene.collection.objects.link(under)
if layer in ("shadow", "start"):
    for k, at in enumerate(stack):
        place(f"s{k}", at, TURN)
if layer == "end":
    for k, at in enumerate(stack[: COUNT - TAKEN]):
        place(f"s{k}", at, TURN)
if layer in ("tray", "landed", "start", "end"):
    tray()
if layer in ("landed", "end"):
    place("landed", landed, TURN)
# The stack's shadow alone: the coins still cast it, but the camera does not
# see them.
if layer == "shadow":
    for obj in euro.objects:
        obj.visible_camera = False

# Shadow catcher on the table. Under the lone coin it stays for what its
# rim mirrors, but leaves out its shadow: the film draws the moving one's.
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, 0))
floor = bpy.context.active_object
floor.is_shadow_catcher = True
if layer == "coin":
    floor.visible_camera = False

# Light: a studio picture for what the metal mirrors, a broad softbox
# where the top coin's face mirrors the camera, and a key from the front
# left that throws the stack's shadow back and to the right, past the
# tray.
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
# What is not a mirror sees a grey sky, so the table only gets the key's
# shadow and a soft one around the foot, none from the studio's lamps. The
# sky fades towards the horizon: a tall stack would otherwise shade the
# table far around it.
grey = nt.nodes["Background"]
grey.inputs["Color"].default_value = (0.5, 0.5, 0.5, 1)
sky_dir = nt.nodes.new("ShaderNodeSeparateXYZ")
nt.links.new(coord.outputs["Generated"], sky_dir.inputs[0])
sky = nt.nodes.new("ShaderNodeMath")
sky.operation = "POWER"
sky.use_clamp = True
sky.inputs[1].default_value = float(os.environ.get("SKY", 1.5))
nt.links.new(sky_dir.outputs["Z"], sky.inputs[0])
sky_strength = nt.nodes.new("ShaderNodeMath")
sky_strength.operation = "MULTIPLY"
sky_strength.inputs[1].default_value = 0.5 * (1 + float(os.environ.get("SKY", 1.5)))
nt.links.new(sky.outputs[0], sky_strength.inputs[0])
nt.links.new(sky_strength.outputs[0], grey.inputs["Strength"])
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

key_dir = Vector((-0.5, -0.4, 1.0)).normalized()
KEY_SIZE = float(os.environ.get("KEY_SIZE", 10))
key_data = bpy.data.lights.new("key", "AREA")
key_data.energy = float(os.environ.get("KEY", 60000))
key_data.size = KEY_SIZE
key_data.color = (1.0, 0.96, 0.9)
key = bpy.data.objects.new("key", key_data)
key.location = key_dir * 80
key.rotation_euler = (-key.location).to_track_quat("-Z", "Y").to_euler()
# The metal mirrors the softbox alone.
key.visible_glossy = False
scene.collection.objects.link(key)

# The camera looks from the front, ELEV above the table. On screen, x runs
# right and v up: v = y sin(ELEV) + z cos(ELEV). The frame takes in the
# stack with the coin's way above it, the tray and the stack's shadow.
sin_e, cos_e = math.sin(ELEV), math.cos(ELEV)
screen_up = Vector((0, sin_e, cos_e))
toward = Vector((0, math.cos(ELEV), -math.sin(ELEV)))
fall = Vector((-key_dir.x / key_dir.z, -key_dir.y / key_dir.z, 0))
height = COUNT * T
tray_w, tray_d = D + 1.1 + 0.72, D + 0.8 + 0.72
reach = [
    (-D / 2, -D / 2 * sin_e),
    (D / 2, (height + LIFT) * cos_e + D / 2 * sin_e),
    (TRAY_AT[0] - tray_w / 2, (TRAY_AT[1] - tray_d / 2) * sin_e),
    (TRAY_AT[0] + tray_w / 2, (TRAY_AT[1] + tray_d / 2) * sin_e + 0.4 * cos_e),
    (fall.x * height + D / 2 + height * KEY_SIZE / 80, (fall.y * height + D / 2) * sin_e),
]
MARGIN = float(os.environ.get("MARGIN", 0.9))
left = min(u for u, _ in reach) - MARGIN
right = max(u for u, _ in reach) + MARGIN
low = min(v for _, v in reach) - MARGIN
high = max(v for _, v in reach) + MARGIN
cam = bpy.data.cameras.new("cam")
cam.type = "ORTHO"
cam.sensor_fit = "HORIZONTAL"
cam.ortho_scale = right - left
cam_obj = bpy.data.objects.new("cam", cam)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj
middle = Vector(((left + right) / 2, 0, 0)) + screen_up * ((low + high) / 2)
cam_obj.location = middle - toward * 60
cam_obj.rotation_euler = toward.to_track_quat("-Z", "Y").to_euler()
scene.render.resolution_x = 2400
scene.render.resolution_y = round(2400 * (high - low) / (right - left))
if os.environ.get("CLOSE"):
    cx, cy, size = (float(v) for v in os.environ["CLOSE"].split(","))
    cam.ortho_scale = size
    cam_obj.location = Vector((cx, 0, 0)) + screen_up * cy - toward * 60
    scene.render.resolution_y = 2400

bpy.context.view_layer.update()
width, height_px = scene.render.resolution_x, scene.render.resolution_y


def pixel(p):
    v = world_to_camera_view(scene, cam_obj, Vector(p))
    return [round(v.x * width, 1), round((1 - v.y) * height_px, 1)]


def minus(a, b):
    return [round(p - q, 1) for p, q in zip(a, b)]


# Where things are, in pixels of the full frame: the lone coin, where it
# sits; the stack's foot, the step from one coin up to the next and how far
# each lies off true; the top coin's way from the stack: lifted, carried
# over the tray and set down in it; and at each of those four points where the coin's
# shadow falls, along the key light onto what lies under it, and how wide
# its soft edge is.
foot = pixel((0, 0, 0))
start = pixel(top)
way = [
    (top, 0),
    ((top[0], top[1], top[2] + LIFT), 0),
    ((*TRAY_AT, top[2] + LIFT), TRAY_FLOOR),
    (landed, TRAY_FLOOR),
]
per_cm = width / (right - left)


def shadow(at, under):
    rise = at[2] - under
    falls = minus(pixel((at[0] + fall.x * rise, at[1] + fall.y * rise, under)), pixel(at))
    return [*falls, round(rise * KEY_SIZE / 80 * per_cm, 1)]


print(
    "SEIZED",
    json.dumps(
        {
            "width": width,
            "coin": start,
            "foot": foot,
            "step": minus(pixel((0, 0, T)), foot),
            "drift": [minus(pixel((x, y, 0)), foot) for x, y in drift],
            "value": VALUE,
            "taken": TAKEN,
            "way": [minus(pixel(at), start) for at, _ in way],
            "shadows": [shadow(at, under) for at, under in way],
        }
    ),
)
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
