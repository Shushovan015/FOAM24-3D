export const CASES = [
    {
        id: "case1",
        label: "Case 1",
        objUrl: "./models/case1.obj",
        foam: { sizeX: 700, sizeY: 500, sizeZ: 370, cornerRadius: 5 },
        modelTransform: {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        },
    },
    {
        id: "case2",
        label: "Case 2",
        objUrl: "./models/case2.obj",
        foam: { sizeX: 1095, sizeY: 690, sizeZ: 480, cornerRadius: 5 },
        modelTransform: {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        },
    },
    {
        id: "case3",
        label: "Case 3",
        objUrl: "./models/case3.obj",
        foam: { sizeX: 519, sizeY: 333, sizeZ: 148, cornerRadius: 5 },
        modelTransform: {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        },
    },
    {
        id: "case4",
        label: "Case 4",
        objUrl: "./models/case4.obj",
        foam: { sizeX: 519, sizeY: 497, sizeZ: 370, cornerRadius: 5 },
        modelTransform: {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
        },
    },
];

export const DEFAULT_CASE = CASES[0];

export function getCaseById(caseId) {
    return CASES.find((c) => c.id === caseId) || DEFAULT_CASE;
}
