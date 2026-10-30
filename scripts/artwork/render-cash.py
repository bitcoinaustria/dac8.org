# Renders the film's opening: what one could move in cash without ID, in
# 100-euro notes, at true scale. Four objects, each rendered alone with
# the same orthographic camera, so their sizes compare:
#   brick: 339 notes of 100 euros (33,900 euros), three banded bundles of
#          100 and 39 loose notes on top
#   bundle: 100 notes of 100 euros (10,000 euros), one banded bundle
#   slim:  13 notes of 100 and one of 50 on top (1,350 euros)
#   cent:  a one-cent coin
#   gold-brick: 47 one-ounce gold coins in four stacks in front of the brick
#   gold-bundle: 2.7 ounces of gold (two coins of one ounce, one of half an
#          ounce, two of a tenth) in front of the bundle
#   plain-brick, plain-bundle: the notes in plain paper, only to line the
#          gold up with the existing note pictures
#   seized-stack, -band, -pair, -landed, -tag, -all: the film's last
#          picture, a bundle of 100 from which the state pulls two, in
#          layers for scripts/artwork/composite-seized.mjs; its own camera
#          (TURN=-46 SIZE=30 ELEV=22), not to the opening's scale
# Usage: blender -b -P scripts/artwork/render-cash.py -- <object> <out.png> [note100.png] [note50.png]
# The note pictures are fictional notes generated with Codex (no serial
# numbers or security features, DAC8.ORG where the issuer would be); the
# renders are cropped to a shared scale into src/assets/history/cash-*.webp.
# At PCT=100 the raw picture has 2400/22 pixels per cm. Export at half
# size (54.54545 px/cm), then crop; never resize individual cutouts to fit.
# The bundle export uses a 1200x750 PNG, then x=126, y=199, w=1013, h=444;
# clear alpha below 32/255 (shadow-catcher noise), WebP quality 82.
# The gold renders keep the notes in the scene as an invisible shadow
# catcher, so coins in front hide them and cast their shadows onto them;
# scripts/artwork/composite-gold.mjs lays them over the note pictures.
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


# The note pictures are only needed where the notes themselves show.
TEXTURED = which in ("brick", "bundle", "slim") or which.startswith("seized")
note100 = material_note(TEX100, "note100") if TEXTURED else None
note50 = material_note(TEX50, "note50") if TEXTURED else None
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



def notes(kind, top, side):
    # The brick or the bundle, the same notes in the same places every time.
    made = []
    z = 0.0
    for b in range(3 if kind == "brick" else 1):
        d = 100 * NOTE
        jx, jy = rnd.uniform(-0.08, 0.08), rnd.uniform(-0.06, 0.06)
        made.append(box(f"bundle{b}", W100, H100, d, top, side, (jx, jy, z), rnd.uniform(-0.006, 0.006)))
        made.append(band(f"band{b}", W100, H100, d, (jx, jy, z), band_mat))
        z += d
    for k in range(39 if kind == "brick" else 0):
        jx, jy = rnd.uniform(-0.25, 0.25), rnd.uniform(-0.18, 0.18)
        made.append(box(f"loose{k}", W100, H100, NOTE, top, side, (jx, jy, z), rnd.uniform(-0.02, 0.02)))
        z += NOTE
    return made


# Gold, polished: the field nearly a mirror, the raised design frosted so it
# reads, the edge reeded.
GOLD = (1.0, 0.66, 0.22)


def material_reeded(name):
    mat = material_plain(name, GOLD, 0.2, 1.0)
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    angle = nt.nodes.new("ShaderNodeTexGradient")
    angle.gradient_type = "RADIAL"
    ridges = nt.nodes.new("ShaderNodeMath")
    ridges.operation = "MULTIPLY"
    ridges.inputs[1].default_value = 150 * math.tau
    wave = nt.nodes.new("ShaderNodeMath")
    wave.operation = "SINE"
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.6
    bump.inputs["Distance"].default_value = 0.004
    nt.links.new(coord.outputs["Object"], angle.inputs["Vector"])
    nt.links.new(angle.outputs["Fac"], ridges.inputs[0])
    nt.links.new(ridges.outputs[0], wave.inputs[0])
    nt.links.new(wave.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return mat


def coin(name, diameter, thickness, at, rot, face):
    # One gold coin lying flat, its centre at `at` on the floor or on the
    # coin below. Only coins whose face shows get the raised design: a rim,
    # organ pipes in the middle, and the legend around them.
    x, y, z = at
    bpy.ops.mesh.primitive_cylinder_add(vertices=192, radius=diameter / 2, depth=thickness, location=(x, y, z + thickness / 2))
    body = bpy.context.active_object
    body.name = name
    body.rotation_euler[2] = rot
    body.data.materials.append(gold_field)
    body.data.materials.append(gold_edge)
    for poly in body.data.polygons:
        poly.material_index = 0 if abs(poly.normal.z) > 0.5 else 1
    bevel = body.modifiers.new("bevel", "BEVEL")
    bevel.width = thickness * 0.12
    bevel.segments = 3
    bpy.ops.object.shade_smooth_by_angle(angle=math.radians(40))
    made = [body]
    if not face:
        return made
    top = z + thickness
    r = diameter / 2
    relief = thickness * 0.06
    bpy.ops.mesh.primitive_torus_add(major_radius=r * 0.93, minor_radius=r * 0.045, location=(x, y, top))
    rim = bpy.context.active_object
    rim.scale[2] = 0.5
    rim.data.materials.append(gold_frost)
    made.append(rim)
    pipes = bpy.data.objects.new(f"{name}-pipes", bpy.data.meshes.new(f"{name}-pipes"))
    scene.collection.objects.link(pipes)
    verts, faces = [], []

    def prism(outline):
        # A flat outline raised off the face, with its walls.
        base = len(verts)
        n = len(outline)
        for vx, vy in outline:
            verts.extend([(vx, vy, 0), (vx, vy, relief)])
        faces.append(tuple(base + 2 * k + 1 for k in range(n)))
        for k in range(n):
            a, b = base + 2 * k, base + 2 * ((k + 1) % n)
            faces.append((a, b, b + 1, a + 1))

    # Organ pipes: slim, with a pointed foot, the tallest at the middle and
    # at both ends, as in the front of a concert-hall organ.
    count = 13
    for k in range(count):
        u = (k - (count - 1) / 2) / ((count - 1) / 2)
        w = r * 0.052
        cx = u * r * 0.5
        foot = r * 0.1
        y0 = -r * 0.26
        y1 = y0 + r * (0.42 + 0.3 * (1 - abs(u)) ** 2 + 0.2 * abs(u) ** 6)
        prism([(cx, y0 - foot), (cx + w / 2, y0), (cx + w / 2, y1), (cx - w / 2, y1), (cx - w / 2, y0)])
    # The ledge under the feet.
    prism([(-r * 0.58, -r * 0.41), (r * 0.58, -r * 0.41), (r * 0.58, -r * 0.36), (-r * 0.58, -r * 0.36)])
    pipes.data.from_pydata(verts, [], faces)
    pipes.data.materials.append(gold_frost)
    pipes.location = (x, y, top)
    pipes.rotation_euler[2] = rot
    made.append(pipes)
    # The legend along a circle, built at the origin and then moved, since
    # text follows its curve in the curve's own space.
    bpy.ops.curve.primitive_bezier_circle_add(radius=r * 0.72, location=(0, 0, 0))
    circle = bpy.context.active_object
    circle.scale[0] = -1
    bpy.ops.object.text_add(location=(0, 0, 0))
    legend = bpy.context.active_object
    legend.data.body = "DAC8.ORG \u00b7 1 UNZE GOLD 999,9"
    legend.data.size = r * 0.17
    legend.data.extrude = relief / 2
    legend.data.space_character = 1.05
    legend.data.follow_curve = circle
    legend.data.materials.append(gold_frost)
    bpy.ops.object.convert(target="MESH")
    legend = bpy.context.active_object
    bpy.data.objects.remove(circle)
    legend.location = (x, y, top + relief / 2)
    # Over the top, so it reads upright.
    legend.rotation_euler[2] = rot + math.radians(262)
    made.append(legend)
    return made


coins = random.Random(47)
# Coins of one ounce, half and a tenth: diameter and thickness in cm.
OUNCE = (3.7, 0.2)
HALF = (2.8, 0.16)
TENTH = (1.6, 0.12)
# Turned so the pipes stand upright as the camera sees them.
UPRIGHT = math.radians(22)


def coin_stack(name, size, count, at):
    made = []
    z = 0.0
    for k in range(count):
        jx, jy = coins.uniform(-0.035, 0.035), coins.uniform(-0.035, 0.035)
        last = k == count - 1
        rot = UPRIGHT + coins.uniform(-0.12, 0.12) if last else coins.uniform(0, math.tau)
        made += coin(f"{name}{k}", *size, (at[0] + jx, at[1] + jy, z), rot, last)
        z += size[1]
    return made


objects = []
# The film's last picture: a bundle of 100 again, from which the state
# pulls the top two notes. One camera renders it in layers, which the film
# moves in two dimensions: the 98 notes left, the band around them, the
# pair alone where it starts, on top under the band, the pair where it
# lands, on the table beside the bundle with its shadow, and the red band
# the state puts around it there. The whole set is turned so that the pair
# slides out towards the front right.
SEIZED_TURN = math.radians(float(os.environ.get("TURN", -32)))
SEIZED_TRAVEL = W100 + 2.6
seized_pair = []
if which.startswith("seized"):
    from mathutils import Matrix

    layer = which.split("-")[1]
    rig = bpy.data.objects.new("rig", None)
    scene.collection.objects.link(rig)
    rig.rotation_euler[2] = SEIZED_TURN
    made = {}
    if layer in ("stack", "band", "all"):
        made["stack"] = box("stack", W100, H100, 98 * NOTE, note100, edge100)
    if layer in ("band", "all"):
        made["band"] = band("band", W100, H100, 100 * NOTE, (0, 0, 0), band_mat)
    landed = layer in ("landed", "tag", "all")
    if layer in ("pair", "landed", "tag", "all"):
        # Two notes out of line, so both show.
        shift = (SEIZED_TRAVEL, 0, -98 * NOTE) if landed else (0, 0, 0)
        for k, (jx, jy, rot) in enumerate(((0.0, 0.0, 0.0), (0.55, -0.4, 0.06))):
            at = (jx + shift[0], jy + shift[1], (98 + k) * NOTE + shift[2])
            seized_pair.append(box(f"pair{k}", W100, H100, NOTE, note100, edge100, at, rot))
    if layer in ("tag", "all"):
        red = material_plain("red", (0.62, 0.015, 0.03), 0.55)
        made["tag"] = band("tag", W100, H100 + 0.6, 2 * NOTE, (SEIZED_TRAVEL + 0.3, -0.2, 0), red, 2.4)
    for obj in [*made.values(), *seized_pair]:
        obj.parent = rig
        objects.append(obj)
    if layer == "band":
        # The band alone, hidden where the stack is in front of it.
        made["stack"].is_holdout = True
    if layer == "tag":
        for obj in seized_pair:
            obj.is_holdout = True
elif which in ("brick", "bundle"):
    objects += notes(which, note100, edge100)
elif which.split("-")[0] in ("gold", "plain"):
    kind = which.split("-")[1]
    # Matte, so the stand-in catches the coins' shadows but no change in
    # what it would mirror.
    paper = material_plain("paper", (0.78, 0.84, 0.72), 1.0)
    paper.node_tree.nodes["Principled BSDF"].inputs["Specular IOR Level"].default_value = 0.0
    gold_field = material_plain("gold-field", GOLD, 0.1, 1.0)
    # A flat field under a camera without perspective mirrors one colour
    # all over; a faint, broad waviness lets the sheen run across it.
    nt = gold_field.node_tree
    wavy = nt.nodes.new("ShaderNodeTexNoise")
    wavy.inputs["Scale"].default_value = 0.35
    wavy.inputs["Detail"].default_value = 1.0
    wavy_bump = nt.nodes.new("ShaderNodeBump")
    wavy_bump.inputs["Strength"].default_value = 0.8
    nt.links.new(wavy.outputs["Fac"], wavy_bump.inputs["Height"])
    nt.links.new(wavy_bump.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])
    gold_frost = material_plain("gold-frost", GOLD, 0.55, 1.0)
    gold_edge = material_reeded("gold-edge")
    stand_in = notes(kind, paper, paper)
    if which.startswith("gold"):
        # The notes stay where they are but only take the coins' shadows.
        for obj in stand_in:
            obj.is_shadow_catcher = True
            obj.visible_shadow = False
        if kind == "brick":
            # 47 ounces in four stacks of 12, 12, 12 and 11, in a row in
            # front of the brick, low enough that its band still shows.
            for name, count, at in (("a", 12, (-4.4, -5.9)), ("b", 12, (-0.5, -6.05)), ("c", 12, (3.4, -5.85)), ("d", 11, (7.2, -6.0))):
                objects += coin_stack(name, OUNCE, count, at)
        else:
            # 2.7 ounces: two tenths, two ounces and a half, in front.
            objects += coin("tenth0", *TENTH, (-5.5, -4.9, 0), UPRIGHT - 0.15, True)
            objects += coin("tenth1", *TENTH, (-3.7, -5.4, 0), UPRIGHT + 0.2, True)
            objects += coin_stack("a", OUNCE, 2, (-0.6, -5.95))
            objects += coin("half", *HALF, (3.2, -5.5, 0), UPRIGHT + 0.1, True)
        # The notes were rendered without the gold, so it may not brighten
        # them with its glow; it still casts its shadow.
        for obj in objects:
            obj.visible_diffuse = False
    else:
        objects += stand_in
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

# Shadow catcher on the floor. The band and the pair on top of the stack
# leave it out: their shadows fall on the notes beneath, not the table.
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, 0))
floor = bpy.context.active_object
floor.is_shadow_catcher = True
if which in ("seized-band", "seized-pair", "seized-tag"):
    floor.hide_render = True

# Light: a large soft key from the top left, a fill from the right, and a
# dim grey world.
world = bpy.data.worlds.new("world")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.42, 0.44, 0.48, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.22
if which.startswith("gold"):
    # Polished gold mirrors its surroundings: reflections see bright studio
    # strips above and a dark floor, everything else the same dim grey.
    nt = world.node_tree
    grey = nt.nodes["Background"]
    world_out = nt.nodes["World Output"]
    studio = nt.nodes.new("ShaderNodeBackground")
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    els = ramp.color_ramp.elements
    els[0].position = 0.0
    els[0].color = (0.03, 0.03, 0.035, 1)
    els[1].position = 1.0
    els[1].color = (0.9, 0.88, 0.85, 1)
    for pos, value in ((0.12, 0.08), (0.22, 1.2), (0.32, 0.15), (0.45, 0.3), (0.6, 0.15), (0.72, 1.6), (0.85, 0.3)):
        e = els.new(pos)
        e.color = (value, value * 0.98, value * 0.95, 1)
    path = nt.nodes.new("ShaderNodeLightPath")
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(coord.outputs["Generated"], sep.inputs["Vector"])
    nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], studio.inputs["Color"])
    nt.links.new(path.outputs["Is Glossy Ray"], mix.inputs["Fac"])
    nt.links.new(grey.outputs["Background"], mix.inputs[1])
    nt.links.new(studio.outputs["Background"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], world_out.inputs["Surface"])
    # A softbox where the coins' faces point the camera's eye: a camera
    # without perspective sees every face mirror the same spot, so that spot
    # is a broad light that fades to its edges. Only mirrors see it.
    away = (-math.sin(math.radians(22)), math.cos(math.radians(22)))
    elev = math.radians(30)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(away[0] * math.cos(elev) * 60, away[1] * math.cos(elev) * 60, math.sin(elev) * 60))
    box = bpy.context.active_object
    box.scale = (46, 30, 1)
    from mathutils import Vector as V

    box.rotation_euler = (V((0, 0, 0)) - box.location).to_track_quat("Z", "Y").to_euler()
    for ray in ("camera", "diffuse", "shadow", "transmission", "volume_scatter"):
        setattr(box, f"visible_{ray}", False)
    glow = bpy.data.materials.new("softbox")
    glow.use_nodes = True
    gnt = glow.node_tree
    gnt.nodes.remove(gnt.nodes["Principled BSDF"])
    emit = gnt.nodes.new("ShaderNodeEmission")
    gcoord = gnt.nodes.new("ShaderNodeTexCoord")
    falloff = gnt.nodes.new("ShaderNodeTexGradient")
    falloff.gradient_type = "SPHERICAL"
    # Strips across the box, so a face that tilts a little runs from
    # bright to dark.
    strips = gnt.nodes.new("ShaderNodeTexWave")
    strips.wave_type = "BANDS"
    strips.bands_direction = "Y"
    strips.inputs["Scale"].default_value = 2.5
    sharpen = gnt.nodes.new("ShaderNodeMath")
    sharpen.operation = "POWER"
    sharpen.inputs[1].default_value = 3.0
    lift = gnt.nodes.new("ShaderNodeMath")
    lift.operation = "MULTIPLY_ADD"
    lift.inputs[1].default_value = 1.8
    lift.inputs[2].default_value = 0.25
    strength = gnt.nodes.new("ShaderNodeMath")
    strength.operation = "MULTIPLY"
    gnt.links.new(gcoord.outputs["Object"], falloff.inputs["Vector"])
    gnt.links.new(gcoord.outputs["Object"], strips.inputs["Vector"])
    gnt.links.new(strips.outputs["Fac"], sharpen.inputs[0])
    gnt.links.new(sharpen.outputs[0], lift.inputs[0])
    gnt.links.new(falloff.outputs["Fac"], strength.inputs[0])
    gnt.links.new(lift.outputs[0], strength.inputs[1])
    gnt.links.new(strength.outputs[0], emit.inputs["Strength"])
    emit.inputs["Color"].default_value = (1.0, 0.97, 0.92, 1)
    gnt.links.new(emit.outputs["Emission"], gnt.nodes["Material Output"].inputs["Surface"])
    box.data.materials.append(glow)


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
elev, yaw, dist = math.radians(float(os.environ.get("ELEV", 30))), math.radians(-22), 60
cam_obj.location = (
    dist * math.cos(elev) * math.sin(-yaw),
    -dist * math.cos(elev) * math.cos(yaw),
    dist * math.sin(elev) + 1.5,
)
target = (0, 0, 1.5)
direction = [target[i] - cam_obj.location[i] for i in range(3)]
from mathutils import Vector

cam_obj.rotation_euler = Vector(direction).to_track_quat("-Z", "Y").to_euler()

if which.startswith("gold"):
    # Room below the frame for the coins' soft shadows: the picture grows
    # downwards and the camera shifts with it, so the top-left corner, the
    # scale and every place in the old frame stay where they were.
    extend = 400
    scene.render.resolution_y = 1500 + extend
    cam.shift_y = -(extend / 2) / 2400
if which.startswith("seized"):
    # Framed on the middle between the bundle and where the pair lands; a
    # little taller than the opening's pictures.
    mid = Vector((SEIZED_TRAVEL / 2, 0, 0))
    mid.rotate(Matrix.Rotation(SEIZED_TURN, 3, "Z"))
    cam_obj.location.x += mid.x
    cam_obj.location.y += mid.y
    cam_obj.location.z -= 1.0
    cam.ortho_scale = float(os.environ.get("SIZE", 33))
    scene.render.resolution_y = 1800
    # Where the pair's corner is, in pixels of the full frame, at the start,
    # at the stack's edge and on the table: the film moves the pair layer
    # along these.
    from bpy_extras.object_utils import world_to_camera_view

    bpy.context.view_layer.update()

    def pixel(local):
        p = rig.matrix_world @ Vector(local)
        v = world_to_camera_view(scene, cam_obj, p)
        return [round(v.x * 2400, 1), round((1 - v.y) * 1800, 1)]

    top = 99 * NOTE
    print(
        "SEIZED",
        {
            "start": pixel((0, 0, top)),
            "slid": pixel((SEIZED_TRAVEL, 0, top)),
            "landed": pixel((SEIZED_TRAVEL, 0, top - 98 * NOTE)),
        },
    )
if os.environ.get("CLOSE"):
    # A close look at one place, e.g. CLOSE=5.3,-10.3,4 (x, y, width in cm).
    cx, cy, size = (float(v) for v in os.environ["CLOSE"].split(","))
    cam.ortho_scale = size
    cam_obj.location = (cam_obj.location[0] + cx, cam_obj.location[1] + cy, cam_obj.location[2] - 1.5 + 2.4)
scene.render.filepath = out
bpy.ops.render.render(write_still=True)
