let state = {
    renderer: null,
    camera: null,
    scene: null,
    controls: null,
    shapes: [],
    selectedShape: null,
    foam: {
        sizeZ: 370 // mm
    },
    history: [],
    historyIndex: -1
};

export const getState = () => state;
export const updateState = (update) => {
    state = { ...state, ...update };
    if(state.selectedShape) {
        state.scene.traverse(child => {
            if(child.userData?.isSelected) {
                child.material.color.set(0xffa500);
            }
        });
    }
};