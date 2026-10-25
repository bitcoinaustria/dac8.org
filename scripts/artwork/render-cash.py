# Renders the film's opening: what one could move in cash without ID, in
# 100-euro notes, at true scale. Four objects, each rendered alone with
# the same orthographic camera, so their sizes compare:
#   brick: 339 notes of 100 euros (33,900 euros), three banded bundles of
#          100 and 39 loose notes on top
#   bundle: 100 notes of 100 euros (10,000 euros), one banded bundle
#   slim:  13 notes of 100 and one of 50 on top (1,350 euros)
#   cent:  a one-cent coin
# Usage: blender -b -P scripts/artwork/render-cash.py -- <object> <out.png> [note100.png] [note50.png]
# The note pictures are fictional notes generated with Codex (no serial
# numbers or security features, DAC8.ORG where the issuer would be); the
# renders are cropped to a shared scale into src/assets/history/cash-*.webp.
# At PCT=100 the raw picture has 2400/22 pixels per cm. Export at half
# size (54.54545 px/cm), then crop; never resize individual cutouts to fit.
# The bundle export uses a 1200x750 PNG, then x=126, y=199, w=1013, h=444;
# clear alpha below 32/255 (shadow-catcher noise), WebP quality 82.
# SAMPLES and PCT lower the cost of previews without changing the camera.
# Add -noaudio to the Blender command on machines without an audio server.
import math
import random
import sys

import bpy

args = sys.argv[sys.argv.index("--") + 1 :]
which, out = args[0], args[1]
import os
KEY = float(os.environ.get("KEY", 78000))
RIM = float(os.environ.get("RIM", 24000))
FILL = float(os.environ.get("FILL", 10000))
PCT = int(os.environ.get("PCT", 100))
SAMPLES = int(os.environ.get("SAMPLES", 320))
TEX100 = args[2] if len(args) > 2 else "/tmp/dac8-note/tex-3.png"
TEX50 = args[3] if len(args) > 3 else "/tmp/dac8-note/tex-4.png"

# Scene units: 1 = 1 cm.
NOTE = 0.0108  # thickness of a note
W100, H100 = 14.7, 7.7
W50, H50 = 14.0, 7.7

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.render.film_transparent = True
scene.render.resolution_x = 2400
scene.render.resolution_y = 1500
scene.render.resolution_percentage = PCT
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "AgX"
scene.view_settings.look = "AgX - Punchy"

rnd = random.Random(1991)


def material_note(path, name):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes["Principled BSDF"]
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(path)
    tex.interpolation = "Cubic"
    mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.48
    bsdf.inputs["Specular IOR Level"].default_value = 0.5
    return mat


def material_edge(name, base, line):
    # Paper edges: one faint line per note, a little uneven.
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "Z"
    wave.inputs["Scale"].default_value = 1 / NOTE / 6.3 / 2.5
    wave.inputs["Distortion"].default_value = 0.6
    wave.inputs["Detail"].default_value = 1.5
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 3.0
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*line, 1)
    ramp.color_ramp.elements[1].color = (*base, 1)
    ramp.color_ramp.elements[0].position = 0.25
    ramp.color_ramp.elements[1].position = 0.75
    mix = nt.nodes.new("ShaderNodeMath")
    mix.operation = "MULTIPLY_ADD"
    mix.inputs[2].default_value = 0.0
    nt.links.new(coord.outputs["Object"], wave.inputs["Vector"])
    nt.links.new(coord.outputs["Object"], noise.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], mix.inputs[0])
    nt.links.new(noise.outputs["Fac"], mix.inputs[1])
    nt.links.new(mix.outputs[0], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.35
    bump.inputs["Distance"].default_value = 0.002
    nt.links.new(wave.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    bsdf.inputs["Roughness"].default_value = 0.8
    return mat


def material_plain(name, color, rough=0.6, metal=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    return mat


def box(name, w, h, d, top_mat, side_mat, at=(0, 0, 0), rot=0.0):
    # A note or a block of notes: the top face carries the note's image,
    # the four sides and the bottom the paper edge.
    x, y = w / 2, h / 2
    verts = [
        (-x, -y, 0), (x, -y, 0), (x, y, 0), (-x, y, 0),
        (-x, -y, d), (x, -y, d), (x, y, d), (-x, y, d),
    ]
    faces = [(4, 5, 6, 7), (0, 3, 2, 1), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    uv = mesh.uv_layers.new()
    tops = [(0, 0), (1, 0), (1, 1), (0, 1)]
    for poly in mesh.polygons:
        for k, li in enumerate(poly.loop_indices):
            uv.data[li].uv = tops[k] if poly.index == 0 else (0.5, 0.5)
    mesh.materials.append(top_mat)
    mesh.materials.append(side_mat)
    for poly in mesh.polygons:
        poly.material_index = 0 if poly.index == 0 else 1
    obj = bpy.data.objects.new(name, mesh)
    obj.location = at
    obj.rotation_euler[2] = rot
    scene.collection.objects.link(obj)
    return obj


def band(name, w, h, d, at, mat, width=3.0):
    # A paper band around a bundle, slightly proud of the notes.
    m = 0.03
    bpy.ops.mesh.primitive_cube_add(size=1)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (width, h + 2 * m, d + 2 * m)
    obj.location = (at[0], at[1], at[2] + d / 2)
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("bevel", "BEVEL")
    bevel.width = 0.02
    return obj


note100 = material_note(TEX100, "note100")
note50 = material_note(TEX50, "note50")
edge100 = material_edge("edge100", (0.93, 0.95, 0.88), (0.62, 0.68, 0.58))
edge50 = material_edge("edge50", (0.97, 0.88, 0.77), (0.76, 0.6, 0.46))


def material_band(name):
    # Paper band: cream with a green stripe near each edge.
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    absx = nt.nodes.new("ShaderNodeMath")
    absx.operation = "ABSOLUTE"
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.interpolation = "CONSTANT"
    cream = (0.95, 0.93, 0.86, 1)
    green = (0.12, 0.42, 0.22, 1)
    els = ramp.color_ramp.elements
    els[0].position = 0.0
    els[0].color = cream
    els[1].position = 0.30
    els[1].color = green
    e = els.new(0.38)
    e.color = cream
    nt.links.new(coord.outputs["Generated"], sep.inputs["Vector"])
    sub = nt.nodes.new("ShaderNodeMath")
    sub.operation = "SUBTRACT"
    sub.inputs[1].default_value = 0.5
    nt.links.new(sep.outputs["X"], sub.inputs[0])
    nt.links.new(sub.outputs[0], absx.inputs[0])
    nt.links.new(absx.outputs[0], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.7
    return mat


band_mat = material_band("band")

objects = []
if which in ("brick", "bundle"):
    z = 0.0
    for b in range(3 if which == "brick" else 1):
        d = 100 * NOTE
        jx, jy = rnd.uniform(-0.08, 0.08), rnd.uniform(-0.06, 0.06)
        objects.append(box(f"bundle{b}", W100, H100, d, note100, edge100, (jx, jy, z), rnd.uniform(-0.006, 0.006)))
        objects.append(band(f"band{b}", W100, H100, d, (jx, jy, z), band_mat))
        z += d
    for k in range(39 if which == "brick" else 0):
        jx, jy = rnd.uniform(-0.25, 0.25), rnd.uniform(-0.18, 0.18)
        objects.append(box(f"loose{k}", W100, H100, NOTE, note100, edge100, (jx, jy, z), rnd.uniform(-0.02, 0.02)))
        z += NOTE
elif which == "slim":
    z = 0.0
    for k in range(13):
        jx, jy = rnd.uniform(-0.2, 0.2), rnd.uniform(-0.15, 0.15)
        objects.append(box(f"n{k}", W100, H100, NOTE, note100, edge100, (jx, jy, z), rnd.uniform(-0.02, 0.02)))
        z += NOTE
    objects.append(box("fifty", W50, H50, NOTE, note50, edge50, (0.3, -0.1, z), 0.035))
elif which == "cent":
    copper = material_plain("copper", (0.78, 0.42, 0.25), 0.32, 1.0)
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=1.625 / 2, depth=0.167, location=(0, 0, 0.167 / 2))
    coin = bpy.context.active_object
    coin.data.materials.append(copper)
    bevel = coin.modifiers.new("bevel", "BEVEL")
    bevel.width = 0.012
    bevel.segments = 3
    bpy.ops.object.shade_smooth()
    objects.append(coin)
    # A raised rim and a "1" on the face.
    bpy.ops.mesh.primitive_torus_add(major_radius=0.74, minor_radius=0.02, location=(0, 0, 0.167))
    rim = bpy.context.active_object
    rim.data.materials.append(copper)
    bpy.ops.object.text_add(location=(0, 0, 0.167))
    one = bpy.context.active_object
    one.data.body = "1"
    one.data.align_x = "CENTER"
    one.data.align_y = "CENTER"
    one.data.size = 0.9
    one.data.extrude = 0.012
    one.data.materials.append(copper)
    for k in range(12):
        a = k / 12 * math.tau
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.028, location=(0.58 * math.cos(a), 0.58 * math.sin(a), 0.167))
        bpy.context.active_object.data.materials.append(copper)
else:
    raise ValueError(f"Unknown cash object: {which}")

# Shadow catcher on the floor.
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, 0))
floor = bpy.context.active_object
floor.is_shadow_catcher = True

# Light: a large soft key from the top left, a fill from the right, and a
# dim grey world.
world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.42, 0.44, 0.48, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.22


def light(name, energy, size, at, color, target=(0, 0, 1.5)):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    obj.location = at
    scene.collection.objects.link(obj)
    from mathutils import Vector as V

    d = V(target) - V(at)
    obj.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
    return obj


# A warm, fairly hard key from the front left and above, a cool rim from
# behind to lift the edges off a dark page, and a weak fill from the
# right so the front faces keep their paper texture.
light("key", KEY, 26, (-38, -42, 58), (1.0, 0.95, 0.88))
light("rim", RIM, 30, (30, 55, 26), (0.82, 0.9, 1.0))
light("fill", FILL, 60, (55, -35, 18), (0.9, 0.94, 1.0))

# The same orthographic camera for every object: from the front right, about
# 30 degrees above the table.
cam = bpy.data.cameras.new("cam")
cam.type = "ORTHO"
cam.ortho_scale = 22.0
cam_obj = bpy.data.objects.new("cam", cam)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj
elev, yaw, dist = math.radians(30), math.radians(-22), 60
cam_obj.location = (
    dist * math.cos(elev) * math.sin(-yaw),
    -dist * math.cos(elev) * math.cos(yaw),
    dist * math.sin(elev) + 1.5,
)
target = (0, 0, 1.5)
direction = [target[i] - cam_obj.location[i] for i in range(3)]
from mathutils import Vector

cam_obj.rotation_euler = Vector(direction).to_track_quat("-Z", "Y").to_euler()

scene.render.filepath = out
bpy.ops.render.render(write_still=True)
