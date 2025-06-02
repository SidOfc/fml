export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type Color = `#${string}` | string | number;

export enum ComponentLevel {
    CEILING = -2,
    WALL = -1,
    FLOOR = 1,
    STACKABLE = 2,
}

export type ComponentLevelObject = {
    [K in keyof typeof ComponentLevel]: (typeof ComponentLevel)[K];
};

export interface Component {
    id: string;
    level: ComponentLevel;
}

export interface Material {
    name: string;
    role: string;
}

export interface MaterialMetadata {
    id: `rs-${number}`;
    name: string;
    url2d: string;
    thumb: {thumb2D: string; thumb3D: string};
}

export interface Variant {
    readonly id: number;
}

export interface Point {
    /**
     * @unit centimeter
     */
    x: number;

    /**
     * @unit centimeter
     */
    y: number;
}

export interface Endpoint3D {
    /**
     * @unit centimeter
     */
    z: number;

    /**
     * @unit centimeter
     */
    h: number;
}

export interface Point3D extends Point {
    /**
     * @unit centimeter
     */
    z: number;
}

export interface BezierPoint extends Point {
    /**
     * @unit centimeter
     */
    cx: number;

    /**
     * @unit centimeter
     */
    cy: number;

    /**
     * @unit centimeter
     */
    cz?: number;
}

export interface GenericLine {
    a: Point;
    b: Point;
}

export interface Line extends GenericLine {
    type: 'solid_line' | 'dashed_line' | 'dotted_line' | 'dashdotted_line';
    color: Color;
    groupMarker?: number;

    /**
     * @unit pixel
     */
    thickness: number;
}

export interface Label extends Point {
    text: string;
    fontFamily: string;
    fontColor: Color;
    backgroundColor: Color;
    align: 'left' | 'center' | 'right';
    bold?: boolean;
    italic?: boolean;
    outline?: boolean;
    underline?: boolean;
    groupMarker?: number;

    /**
     * @unit pixel
     */
    fontSize: number;

    /**
     * @unit pixel
     */
    letterSpacing: number;

    /**
     * @unit degree
     * @range -180.0, 180.0
     */
    rotation: number;

    /**
     * @unit percentage
     * @range 0.0, 100.0
     */
    backgroundAlpha?: number;

    /**
     * @unit percentage
     * @range 0.0, 100.0
     */
    fontAlpha?: number;
}

export interface Item extends Point3D {
    refid: Component['id'];
    light?: {on: boolean; color: Color; watt: number};
    materials?: {[material_name: Material['name']]: Variant['id']} | [];
    features?: {[intiaro_material_role: string]: string};
    configuration?: {type: 'intiaro'; id: UUID};
    mirrored?: [x: 0 | 1, y: 0 | 1];
    groupMarker?: number;

    /**
     * @unit centimeter
     */
    width: number;

    /**
     * @unit centimeter
     */
    height: number;

    /**
     * @unit centimeter
     */
    z_height?: number;

    /**
     * @unit degree
     * @range -180.0, 180.0
     */
    rotation: number;

    /**
     * item tilt
     *
     * @unit degree
     * @range -180.0, 180.0
     */
    rotation_x?: number;

    /**
     * item roll
     *
     * @unit degree
     * @range -180.0, 180.0
     */
    rotation_y?: number;

    /**
     * @unit centimeter
     */
    snapDist: number;
}

export interface GenericOpening {
    refid: Component['id'];
    name?: string;
    showLabel?: boolean;
    frontDoor?: boolean;
    internalDoor?: boolean;
    frameColor?: Color;
    materials?: {
        [material_name: string]:
            | {type: 'color'; value: Color}
            | {type: 'asset'; value: Component['id']}
            | {type: 'variant'; value: number};
    };

    /**
     * @range 0.0, 1.0
     */
    t: number;

    /**
     * @unit centimeter
     */
    z: number;

    /**
     * @unit centimeter
     */
    z_height: number;

    /**
     * @unit centimeter
     */
    width: number;

    /**
     * @range 0.0, 1.0
     */
    openState: number;

    /**
     * @unit pixel
     */
    name_x?: number;

    /**
     * @unit pixel
     */
    name_y?: number;
}

export interface Door extends GenericOpening {
    type: 'door';
    doorColor?: Color;
    mirrored?: [x: 0 | 1, y: 0 | 1];
    threshold?: {color: Color} | Partial<MaterialMetadata>;
}

export interface Window extends GenericOpening {
    type: 'window';
}

export type Opening = Door | Window;

export type WallDecor =
    | {color: Color}
    | {refid: Component['id']}
    | {
          texture: {
              src: string;

              /**
               * @unit centimeter
               */
              tlx: number;

              /**
               * @unit centimeter
               */
              tly: number;

              /**
               * @unit centimeter
               */
              brx: number;

              /**
               * @unit centimeter
               */
              bry: number;

              fit:
                  | 'free'
                  | 'no-stretch'
                  | 'fill'
                  | 'contain'
                  | 'tile-horizontally'
                  | 'tile-vertically'
                  | 'tile-both';
          };
      };

export interface Wall extends GenericLine {
    c?: Point;
    az: Endpoint3D;
    bz: Endpoint3D;
    left: {a: Point; b: Point};
    right: {a: Point; b: Point};
    openings: Opening[];
    decor?: {left?: WallDecor; right?: WallDecor};
    groupMarker?: number;

    /**
     * @unit centimeter
     */
    thickness: number;

    /**
     * @range 0.0, 1.0
     */
    balance: number;
}

export interface TextureTransform {
    /**
     * @unit degree
     * @range -180.0, 180.0
     */
    rotation?: number;

    /**
     * @unit pixel
     */
    tx?: number;

    /**
     * @unit pixel
     */
    ty?: number;

    /**
     * @unit pixel
     */
    sx?: number;

    /**
     * @unit pixel
     */
    sy?: number;
}

export interface GenericArea extends TextureTransform {
    poly: Point[];
    name?: string;
    role?: number;
    refid?: Component['id'];
    color?: Color;
    customName?: string;
    hideIn3D?: boolean;
    showAreaLabel?: boolean;
    showSurfaceArea?: boolean;
    dottedOutline?: boolean;
    dottedOutlineColor?: Color;
    ceiling?: {
        enabled: boolean;
        color?: Color;
        asset?: Partial<MaterialMetadata>;
    };
    room_type_id?: number;
    roomstyle_id?: UUID;
    styleboard_id?: number;
    groupMarker?: number;
    pattern?:
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6
        | 7
        | 8
        | 9
        | 10
        | 11
        | 12
        | 13
        | 14
        | 15
        | 16
        | 17
        | 18
        | 19
        | 20
        | 21
        | 22;

    /**
     * @unit centimeter
     */
    name_x?: number;

    /**
     * @unit centimeter
     */
    name_y?: number;

    /**
     * @unit degree
     * @range -180.0, 180.0
     */
    patternRotation?: number;

    /**
     * @unit percentage
     * @range 0.0, 100.0
     */
    patternAlpha?: number;

    /**
     * @unit percentage
     * @range 10.0, 400.0
     */
    patternScale?: number;
}

export interface Area extends GenericArea {
    poly: Point[];
    ceiling?:
        | {enabled: boolean; color: Color}
        | {enabled: boolean; refid: Component['id']};
}

export interface Surface extends GenericArea {
    /**
     * poly is tricky due to variance in point shapes:
     *
     * | {x number, y: number, z: number}
     * | {x number, y: number, cx: number, cy: number}
     * | {x number, y: number, cx: number, cy: number, cz: number}
     *
     * this is the case due to BezierPoint extending from Point
     * instead of Point3D.
     */
    poly: (Point3D | BezierPoint)[];
    isRoof?: boolean;
    isCutout?: boolean;

    /**
     * @unit centimeter
     */
    thickness?: number;

    /**
     * @unit percentage
     * @range 0.0, 100.0
     */
    transparency?: number;
}

export type CameraBackgroundImage =
    | {type_name: 'plane'; url: string}
    | {type_name: 'sphere'; url: string; sky_id: number};

export interface CameraLightSettings {
    day: boolean;
    dayTime:
        | 'Sunrise'
        | 'Morning'
        | 'Midday'
        | 'Afternoon'
        | 'Sunset'
        | 'Evening'
        | 'Night';
    scene: 'SKY' | 'Golfclub' | 'USK' | 'FP' | 'Mountns' | 'Studio';
    profile: boolean;
    clouds: 1 | 2 | 3;
    altitude: number;
    azimuth: number;

    /**
     * @unit percentage
     * @range 0.0, 100.0
     */
    intensity: number;
}

export interface Camera extends Point3D {
    name: string;
    type_name: 'orbital' | 'walkthrough';
    lightSettings: CameraLightSettings;
    background_image?: CameraBackgroundImage;
    groupMarker?: number;
    fov: number;
    dx: number;
    dy: number;
    dz: number;

    /**
     * @range -1.0, 1.0
     */
    ux: number;

    /**
     * @range -1.0, 1.0
     */
    uy: number;

    /**
     * when -1 editor will set it to 1 on init
     *
     * @range -1.0, 1.0
     */
    uz: number;
}

export interface FloorCamera extends Camera {
    id: number;
}

export interface DesignSettings {
    showCeilings3D: boolean;
    engineAutoDims: boolean;
    engineAutoThickness: boolean;

    /**
     * @range 0.1, 5.0
     */
    scaleMultiplierDimensions: number;

    /**
     * @range 0.1, 5.0
     */
    scaleMultiplierComments: number;

    /**
     * @range 0.5, 3.0
     */
    areaLabelMultiplier: number;

    /**
     * @unit centimeter
     */
    minWallLength?: number;
}

export interface Design {
    id: number;
    name: string;
    items: Item[];
    lines: Line[];
    walls: Wall[];
    areas: Area[];
    labels: Label[];
    cameras: Camera[];
    surfaces: Surface[];
    settings?: DesignSettings;
}

export interface Drawing {
    url: string;
    visible: boolean;

    /**
     * @default 'HIGH'
     */
    depth: 'LOW' | 'HIGH';

    /**
     * @unit centimeter
     */
    x: number;

    /**
     * @unit centimeter
     */
    y: number;

    /**
     * @unit centimeter
     */
    width: number;

    /**
     * @unit centimeter
     */
    height: number;

    /**
     * @unit degree
     * @range -180.0, 180.0
     */
    rotation: number;

    /**
     * @unit percentage
     * @range 0.0, 100.0
     */
    alpha: number;
}

export interface Floor {
    id: number;
    name: string;
    level: number;
    designs: Design[];
    drawing?: Drawing;

    /**
     * deprecated since cameras have moved to Design
     */
    cameras?: FloorCamera[];

    /**
     * default wall height when drawing walls
     *
     * @unit centimeter
     */
    height: number;
}

export interface ProjectSettings {
    useMetric: boolean;
    showGrid: boolean;
    showDims: boolean;
    showShortDims: boolean;
    showAreaDims: boolean;
    generateOuterDimension: boolean;
    showDropShadows: boolean;
    showObjects: boolean;
    showFixtures: boolean;
    showFixtures3D: boolean;
    showItemOutline: boolean;
    showObjectColour: boolean;
    showStructuralColour: boolean;
    showFloorsBelow: boolean;
    showNorthArrow: boolean;
    showObjects3D: boolean;
    showObjectMono: boolean;
    showSymbols: boolean;
    showLights: boolean;
    hideLightsOnPan: boolean;
    useSection3D: boolean;
    showLabels: boolean;
    areaLabelOutline: boolean;
    automaticAreaLabelColor: boolean;
    blueprintMode: boolean;
    dimLineFont: string;
    dimLineLabelHorizontal: boolean;
    exportLabels3D: boolean;
    showShadows3D: boolean;
    exportOrtho3D: boolean;
    showTexts: boolean;
    hideItemsAbove: boolean;
    xRayWalls: boolean;
    arrowHeadType: 'arrow-stop' | 'stop' | 'reverse-arrow-stop' | 'arrow';
    visuals: 'ALL' | 'BW' | 'BWC';

    /**
     * @unit centimeter
     */
    wallHeight: number;

    /**
     * @unit centimeter
     */
    wallSectionHeight: number;

    /**
     * @unit centimeter
     */
    wallThickness: number;

    /**
     * @unit centimeter
     */
    wallOuterThickness: number;

    /**
     * @unit pixel
     */
    areaLabelLetterSpacing: number;

    /**
     * @unit degree
     * @range -180.0, 180.0
     */
    northArrowRotation: number;

    /**
     * back-end id
     */
    northArrowKind: number;

    /**
     * @unit centimeter
     */
    hideItemsAboveHeight: number;
}

export interface Project {
    id: number;
    name: string;
    public: boolean;
    floors: Floor[];
    settings?: ProjectSettings;
}
