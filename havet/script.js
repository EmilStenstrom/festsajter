window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function create_bubbles(num_bubbles){
    var bubble = new Path.Circle({
        center: [0, 0],
        radius: 10,
    });
    bubble.fillColor = {
        gradient: {
            stops: [
                [new Color(0.26, 0.46, 0.71, 0), 0.8],
                [new Color(1, 1, 1, 0.7), 1]
            ],
            radial: true
        },
        origin: bubble.position + new Point(0, 2),
        destination: bubble.bounds.rightCenter
    }

    var layer = new Layer();
    var symbol = new Symbol(bubble);
    for (var i = 1; i <= num_bubbles; i++) {
        var placedSymbol = symbol.place(Point.random() * view.size);
        placedSymbol.scale(i / num_bubbles);
        layer.addChild(placedSymbol);
    }
    return layer;
}

function create_levels(num_levels, num_waves){
    var layer = new Layer();
    for (var j = 1; j <= num_levels; j++) {
        var level = new Path({
            strokeColor: new Color(0.26, 0.46, 0.71),
            closed: true,
            fillColor: {
                gradient: {
                    stops: [
                        [new Color(0.21, 0.41, 0.66), 0],
                        [new Color(0.21, 0.41, 0.66, 0.4), 0.1],
                        [new Color(0.21, 0.41, 0.66), 0.8],
                        [new Color(0, 0, 0, 0.8, 0.5), 1],
                    ]
                },
                origin: view.bounds.topCenter,
                destination: view.bounds.bottomCenter,
            }
        });
        level.add(view.bounds.bottomLeft);
        for (var i = -2; i <= num_waves + 2; i++) {
            var point = new Point(i / num_waves, 0) * view.size;
            level.add(point);
        }
        level.add(view.bounds.bottomRight);
        layer.addChild(level);
    }
    return layer;
}

function create_sky(layer_levels, layer_creatures, layer_bubbles){
    var layer = new Layer();
    var sky = layer_levels.children[0].clone();
    var group = new Group(sky, layer_creatures, layer_bubbles)
    group.clipped = true;
    layer.addChild(group)
    return layer;
}

function switch_creature(){
    POSSIBLE_CREATURES = [
        "shell",
        "jellyfish",
        "blowfish",
        "octopussy",
        "eel",
        "crab",
        "seahorse",
    ];
    return POSSIBLE_CREATURES[Math.floor(Math.random() * POSSIBLE_CREATURES.length)];
}

function create_creatures(){
    var layer = new Layer();
    creature = new Raster(switch_creature());
    creature.position = view.topCenter;
    creature.scale(0.8);
    var creature_path = new Path();
    var segments = 10;
    for (var i = -2; i <= segments + 2; i++) {
        var x = i * view.bounds.width / segments;
        var direction = (i % 2 == 0)? 1: -1;
        var y = 200 + direction * 50;
        creature_path.add(new Point(x, y));
    }

    var leftfloor = new Raster("seaweed");
    leftfloor.scale(0.5);
    leftfloor.position = new Point(
        view.bounds.left + leftfloor.bounds.width / 1.5,
        view.bounds.bottom - leftfloor.bounds.height / 1.5
    );

    var rightfloor = new Raster("starfish");
    rightfloor.rotate(15);
    rightfloor.position = new Point(
        view.bounds.right - rightfloor.bounds.width / 4,
        view.bounds.bottom - rightfloor.bounds.height / 6
    );

    return layer;
}

function create_chest(){
    var layer = new Layer();
    var chest = new Raster("chest");
    chest.position = view.bounds.bottomRight + new Point(-chest.width/1.5, -chest.height/1.5);
    return layer;
}

var layer_levels = create_levels(3, 20);
var layer_bubbles = create_bubbles(50);
var layer_creatures = create_creatures();
var layer_chest = create_chest();
var layer_sky = create_sky(layer_levels, layer_creatures, layer_bubbles);

function calc_y(event, i, j, i_max, j_max) {
    var wave_num = i + 1;
    var wave_max = i_max + 1;
    var level_num = j + 1;
    var level_max = j_max + 1;

    var height = 10 + 10 * level_num / level_max;
    var offset = 50;
    var direction = (level_num / level_max) * ((level_num % 2 == 0)? 1: -1);
    return Math.sin(event.time + direction * wave_num) * height + offset;
}

var offset = 0;
function onFrame(event) {
    if (window.mobilecheck()) {
        return;
    }

    var num_bubbles = layer_bubbles.children.length;
    for (var i = 0; i < num_bubbles; i++) {
        var bubble = layer_bubbles.children[i];
        bubble.position.y -= bubble.bounds.width / 100;
        bubble.position.x += Math.sin(event.time + i) / 10;
        bubble.opacity = bubble.bounds.bottom * 1.5 / view.size.height;

        if (bubble.bounds.bottom < 0) {
            bubble.position.y = view.size.height - i;
        }
    }

    var num_levels = layer_levels.children.length;
    for (var j = 0; j < num_levels; j++) {
        var level = layer_levels.children[j];
        var num_waves = level.segments.length;
        for (var i = 1; i < num_waves - 1; i++) {
            var wave = level.segments[i];
            wave.point.y = calc_y(event, i, j, num_waves, num_levels)
        }
        level.smooth();
    }

    var sky = layer_sky.children[0].children[0];
    var num_waves = sky.segments.length;
    for (var i = 1; i < num_waves - 1; i++) {
        var wave = sky.segments[i];
        var num_levels = layer_levels.children.length;
        new_y = [view.size.height]
        for (var j = 0; j < num_levels; j++) {
            new_y = Math.min(new_y, calc_y(event, i, j, num_waves, num_levels));
        }
        wave.point.y = new_y;
    }
    sky.smooth();

    var creature = layer_creatures.children[0];
    var creature_path = layer_creatures.children[1];
    if (offset < creature_path.length) {
        creature.position = creature_path.getPointAt(offset);
        creature.visible = true;
        offset += event.delta * 150;
    } else {
        offset = 0;
        creature = new Raster(switch_creature());
        creature.visible = false;
        creature.scale(0.8);
        layer_creatures.children[0] = creature;
    }
}
