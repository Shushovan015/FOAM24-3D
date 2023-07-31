import * as jscad from "@jscad/modeling";
import * as THREE from "three";
import * as OrbitControls from "three/examples/jsm/controls/OrbitControls";
import * as OBJLoader from "three/examples/jsm/loaders/OBJLoader";
import * as earcut from "earcut";
//import * as uuid from "uuid";
import * as getImageOutline from "image-outline";
import * as PDF from "pdf-lib";

// Assets
import case1Url from "url:./models/case1.obj";

/* UI */

let panels
let currPanel

function showPanelFromRight(id) {
   let nextPanel = document.querySelector("#"+id);

   if (nextPanel == currPanel) {
      return;
   }

   currPanel.style.animationName = "disappear-left";
   currPanel.style.animationDuration = "0.25s";
   currPanel.style.animationFillMode = "forwards";
   currPanel.style.pointerEvents = "none";
   nextPanel.style.animationName = "appear-right";
   nextPanel.style.animationDuration = "0.25s";
   nextPanel.style.animationFillMode = "forwards";
   nextPanel.style.pointerEvents = "auto";

   currPanel = nextPanel;
}

function showPanelFromLeft(id) {
   let nextPanel = document.querySelector("#"+id);

   if (nextPanel == currPanel) {
      return;
   }

   currPanel.style.animationName = "disappear-right";
   currPanel.style.animationDuration = "0.25s";
   currPanel.style.animationFillMode = "forwards";
   currPanel.style.pointerEvents = "none";
   nextPanel.style.animationName = "appear-left";
   nextPanel.style.animationDuration = "0.25s";
   nextPanel.style.animationFillMode = "forwards";
   nextPanel.style.pointerEvents = "auto";

   currPanel = nextPanel;
}

function togglePanels() {
   let container = document.querySelector("#panel-container");
   if (container.style.animationName == "disappear-top") {
      container.style.animationName = "appear-top";
      container.style.animationDuration = "0.25s";
      container.style.animationFillMode = "forwards";
   } else {
      container.style.animationName = "disappear-top";
      container.style.animationDuration = "0.25s";
      container.style.animationFillMode = "forwards";
   }
}

let sidebar

function initUI() {
    document.querySelectorAll("button").forEach((button) => {
       let {icon} = button.dataset
       if (icon) {
          let i = document.createElement("i");
          i.innerText = icon;
          i.classList.add("material-symbols-outlined");
          button.prepend(i);
       }
    })

    panels = document.querySelectorAll(".panel")
    panels.forEach((panel) => {
       panel.style.opacity = 0;
       panel.style.pointerEvents = "none";
    })
    currPanel = panels[0];
    currPanel.style.opacity = 1;
    currPanel.style.pointerEvents = "auto";    
    
    sidebar = document.querySelector("#sidebar");
    

    document.querySelector("#shapes-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
           document.querySelector("#back-button").setAttribute("disabled", "");
           showPanelFromLeft("main-panel")
           selected = null
        }       
        showPanelFromRight("shapes-panel")
    }
    document.querySelector("#foam-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
           document.querySelector("#back-button").setAttribute("disabled", "");
           showPanelFromLeft("main-panel")
           selected = null
        }  
       showPanelFromRight("foam-panel")
    }
    document.querySelector("#case-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
           document.querySelector("#back-button").setAttribute("disabled", "");
           showPanelFromLeft("main-panel")
           selected = null
        }  
       showPanelFromRight("case-panel")
    }
    /*
    ["#create-rectangle", "#create-polygon", "#create-circle"].forEach((id) => {
          document.querySelector(id).onclick = () => {
             document.querySelector("#back-button").removeAttribute("disabled");
             showPanelFromRight("shape-panel")
          }
       })
    */

    document.querySelector("#create-photoshape").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
           document.querySelector("#back-button").setAttribute("disabled", "");
           showPanelFromLeft("main-panel")
           selected = null
        }  
       showPanelFromRight("upload-photo-panel")
       document.querySelector("#upload-photo-input").value = null
    }    
    
    document.querySelector("#upload-photo-input").onchange = (e) => {
        console.log(e.target.files[0])
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.onload = (e) => {
            document.querySelector("#upload-photo-img").onload = (e) => {
            
                let polygon = getImageOutline(e.target).map(({x, y}) => [x, y])
                let box = new THREE.Box2()
                polygon.forEach(([x, y]) => { box.expandByPoint(new THREE.Vector2(x, y)) })
                let center = box.getCenter(new THREE.Vector2())
                polygon = polygon.map(([x, y]) => [center.x - x, y - center.y])
                polygon.reverse()
                console.log(polygon)
                let shape = {
                  kind: "photoshape",
                  x: 0, // mouseRayPlaneIntersection.x,
                  y: 0, //mouseRayPlaneIntersection.y,
                  sizeZ: 250*millimeters,
                  polygon,
                  rotation: 0,
                }
                shapesArray.push(shape);
                commit();
                doCsg()
                selected = shape;     
                showPanelFromRight(selected.kind+"-panel");                        
            }
            document.querySelector("#upload-photo-img").src = e.target.result
        }
        reader.readAsDataURL(file)
    }
    
    document.querySelector("#create-rectangle").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
           document.querySelector("#back-button").setAttribute("disabled", "");
           showPanelFromLeft("main-panel")
           selected = null
        }  
        let shape = {
          kind: "rectangle",
          x: 0, // mouseRayPlaneIntersection.x,
          y: 0, //mouseRayPlaneIntersection.y,
          sizeZ: 250*millimeters,
          sizeX: 200*millimeters,
          sizeY: 200*millimeters,
          rotation: 0,
        }
        shapesArray.push(shape);
        commit()
        selected = shape;
        showPanelFromRight(selected.kind+"-panel");        
        doCsg();        
    }    
    
    document.querySelector("#create-circle").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
           document.querySelector("#back-button").setAttribute("disabled", "");
           showPanelFromLeft("main-panel")
           selected = null
        }  
        let shape = {
          kind: "circle",
          x: 0, // mouseRayPlaneIntersection.x,
          y: 0, //mouseRayPlaneIntersection.y,
          sizeZ: 250*millimeters,
          radius: 100*millimeters,
        }
        shapesArray.push(shape);
        commit();
        selected = shape;
        showPanelFromRight(selected.kind+"-panel");
        doCsg();        
    }
    
    document.querySelector("#radius-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
            document.querySelector("#back-button").onclick = () => {
               document.querySelector("#back-button").setAttribute("disabled", "");
               showPanelFromLeft("main-panel")
               selected = null
            }  
           showPanelFromLeft(selected.kind+"-panel")
        }  
       showPanelFromRight("radius-panel")  
       document.querySelector("#radius-input").value = selected.radius
       document.querySelector("#radius-slider").value = selected.radius
    }    
    
    document.querySelector("#depth-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
            document.querySelector("#back-button").onclick = () => {
               document.querySelector("#back-button").setAttribute("disabled", "");
               showPanelFromLeft("main-panel")
               selected = null
            }  
           showPanelFromLeft(selected.kind+"-panel")
        }  
       showPanelFromRight("depth-panel")     
       document.querySelector("#depth-input").value = selected.sizeZ
       document.querySelector("#depth-slider").value = selected.sizeZ       
    }      
    
    document.querySelector("#radius-slider").oninput = (e) => {
        
        document.querySelector("#radius-input").value = e.target.value
        selected.radius = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#radius-input").oninput = (e) => {
        document.querySelector("#radius-slider").value = e.target.value
        selected.radius = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#radius-slider").onchange = commit    
    document.querySelector("#radius-input").onchange = commit
    
    document.querySelector("#depth-slider").oninput = (e) => {
        
        document.querySelector("#depth-input").value = e.target.value
        selected.sizeZ = Number(e.target.value)
        doCsg()
    }
        
    document.querySelector("#depth-input").oninput = (e) => {
        document.querySelector("#depth-slider").value = e.target.value
        selected.sizeZ = Number(e.target.value)
        doCsg()
    }    
    
    document.querySelector("#depth-slider").onchange = commit    
    document.querySelector("#depth-input").onchange = commit    
    
    document.querySelector("#delete-button").onclick = () => {
        shapesArray.splice(shapesArray.indexOf(selected), 1);
        commit()
        doCsg();
        document.querySelector("#back-button").setAttribute("disabled", "");
        showPanelFromLeft("main-panel")
        selected = null        
    }
    
    document.querySelector("#rectangle-resize-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
            document.querySelector("#back-button").onclick = () => {
               document.querySelector("#back-button").setAttribute("disabled", "");
               showPanelFromLeft("main-panel")
               selected = null
            }  
           showPanelFromLeft(selected.kind+"-panel")
        }  
       showPanelFromRight("rectangle-resize-panel")  
       document.querySelector("#rectangle-width-input").value = selected.sizeX
       document.querySelector("#rectangle-width-slider").value = selected.sizeX
       document.querySelector("#rectangle-height-input").value = selected.sizeY
       document.querySelector("#rectangle-height-slider").value = selected.sizeY
    }    
    
    document.querySelector("#rectangle-depth-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
            document.querySelector("#back-button").onclick = () => {
               document.querySelector("#back-button").setAttribute("disabled", "");
               showPanelFromLeft("main-panel")
               selected = null
            }  
           showPanelFromLeft(selected.kind+"-panel")
        }  
       showPanelFromRight("rectangle-depth-panel")     
       document.querySelector("#rectangle-depth-input").value = selected.sizeZ
       document.querySelector("#rectangle-depth-slider").value = selected.sizeZ       
    }      
    
    document.querySelector("#rectangle-rotate-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
            document.querySelector("#back-button").onclick = () => {
               document.querySelector("#back-button").setAttribute("disabled", "");
               showPanelFromLeft("main-panel")
               selected = null
            }  
           showPanelFromLeft(selected.kind+"-panel")
        }  
       showPanelFromRight("rectangle-rotate-panel")     
       document.querySelector("#rectangle-rotate-input").value = selected.rotation
       document.querySelector("#rectangle-rotate-slider").value = selected.rotation       
    }        
    
    document.querySelector("#rectangle-width-slider").oninput = (e) => {
        document.querySelector("#rectangle-width-input").value = e.target.value
        selected.sizeX = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#rectangle-width-input").oninput = (e) => {
        document.querySelector("#rectangle-width-slider").value = e.target.value
        selected.sizeX = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#rectangle-width-slider").onchange = commit    
    document.querySelector("#rectangle-width-input").onchange = commit      
    
    document.querySelector("#rectangle-height-slider").oninput = (e) => {
        document.querySelector("#rectangle-height-input").value = e.target.value
        selected.sizeY = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#rectangle-height-input").oninput = (e) => {
        document.querySelector("#rectangle-height-slider").value = e.target.value
        selected.sizeY = Number(e.target.value)
        doCsg()
    }    
    
    document.querySelector("#rectangle-height-slider").onchange = commit    
    document.querySelector("#rectangle-height-input").onchange = commit     
    
    document.querySelector("#rectangle-rotate-input").oninput = (e) => {
        document.querySelector("#rectangle-rotate-slider").value = e.target.value
        selected.rotation = Number(e.target.value)
        doCsg()
    }  

    document.querySelector("#rectangle-rotate-slider").oninput = (e) => {
        document.querySelector("#rectangle-rotate-input").value = e.target.value
        selected.rotation = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#rectangle-rotate-slider").onchange = commit    
    document.querySelector("#rectangle-rotate-input").onchange = commit     
    
    document.querySelector("#rectangle-depth-slider").oninput = (e) => {
        
        document.querySelector("#rectangle-depth-input").value = e.target.value
        selected.sizeZ = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#rectangle-depth-input").oninput = (e) => {
        document.querySelector("#rectangle-depth-slider").value = e.target.value
        selected.sizeZ = Number(e.target.value)
        doCsg()
    }    
    
    document.querySelector("#rectangle-depth-slider").onchange = commit    
    document.querySelector("#rectangle-depth-input").onchange = commit      
    
    document.querySelector("#rectangle-delete-button").onclick = () => {
        shapesArray.splice(shapesArray.indexOf(selected), 1);
        commit()
        doCsg();
        document.querySelector("#back-button").setAttribute("disabled", "");
        showPanelFromLeft("main-panel")
        selected = null        
    }    
    
    document.querySelector("#photoshape-depth-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
            document.querySelector("#back-button").onclick = () => {
               document.querySelector("#back-button").setAttribute("disabled", "");
               showPanelFromLeft("main-panel")
               selected = null
            }  
           showPanelFromLeft(selected.kind+"-panel")
        }  
       showPanelFromRight("photoshape-depth-panel")     
       document.querySelector("#photoshape-depth-input").value = selected.sizeZ
       document.querySelector("#photoshape-depth-slider").value = selected.sizeZ       
    }      
    
    document.querySelector("#photoshape-rotate-button").onclick = () => {
        document.querySelector("#back-button").removeAttribute("disabled");
        document.querySelector("#back-button").onclick = () => {
            document.querySelector("#back-button").onclick = () => {
               document.querySelector("#back-button").setAttribute("disabled", "");
               showPanelFromLeft("main-panel")
               selected = null
            }  
           showPanelFromLeft(selected.kind+"-panel")
        }  
       showPanelFromRight("photoshape-rotate-panel")     
       document.querySelector("#photoshape-rotate-input").value = selected.rotation
       document.querySelector("#photoshape-rotate-slider").value = selected.rotation       
    }        

    document.querySelector("#photoshape-rotate-input").oninput = (e) => {
        document.querySelector("#photoshape-rotate-slider").value = e.target.value
        selected.rotation = Number(e.target.value)
        doCsg()
    }  

    document.querySelector("#photoshape-rotate-slider").oninput = (e) => {
        document.querySelector("#photoshape-rotate-input").value = e.target.value
        selected.rotation = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#photoshape-rotate-slider").onchange = commit    
    document.querySelector("#photoshape-rotate-input").onchange = commit     
    
    document.querySelector("#photoshape-depth-slider").oninput = (e) => {
        
        document.querySelector("#photoshape-depth-input").value = e.target.value
        selected.sizeZ = Number(e.target.value)
        doCsg()
    }
    
    document.querySelector("#photoshape-depth-input").oninput = (e) => {
        document.querySelector("#photoshape-depth-slider").value = e.target.value
        selected.sizeZ = Number(e.target.value)
        doCsg()
    }    
    
    document.querySelector("#photoshape-depth-slider").onchange = commit    
    document.querySelector("#photoshape-depth-input").onchange = commit      
    
    document.querySelector("#photoshape-delete-button").onclick = () => {
        shapesArray.splice(shapesArray.indexOf(selected), 1);
        commit()
        doCsg();
        document.querySelector("#back-button").setAttribute("disabled", "");
        showPanelFromLeft("main-panel")
        selected = null        
    }            
    
    document.querySelector("#undo-button").onclick = undo
    document.querySelector("#redo-button").onclick = redo
    
    document.querySelector("#pdf-button").onclick = async () => {
        let pdf = await PDF.PDFDocument.create()
        let font = await pdf.embedFont(PDF.StandardFonts.Helvetica)
        
        //PDF.PDFDocument.create().then((pdf) => {
            let w = PDF.PageSizes.A3[1]
            let h = PDF.PageSizes.A3[0]
            let page = pdf.addPage([w,h])
            
            //page.drawText("Hello, world!")
            
            function drawShape(shape) {
                let geom2 = shapeToGeom2(shape)

                geom2.sides.forEach((side) => {
                    page.drawLine({
                        start: {x: side[0][0] + w/2, y: side[0][1] + h/2},
                        end: {x: side[1][0] + w/2, y: side[1][1] + h/2},
                        thickness: 2,
                    })
                })
            }
            
            function drawDepthMeasurement(shape) {
                let geom2 = shapeToGeom2(shape)

                let centroidx = 0
                let centroidy = 0                    
                
                geom2.sides.forEach((side) => {
                    centroidx += side[0][0]
                    centroidy += side[0][1]
                })                    
                
                centroidx /= geom2.sides.length
                centroidy /= geom2.sides.length
                
                let fontSize = 16
                let text = "T=" + shape.sizeZ.toFixed(2)
                let textw = font.widthOfTextAtSize(text, fontSize)
                let texth = font.heightAtSize(fontSize)
                //let texth = font.heightOfTextAtSize(text, fontSize)
                page.drawText(text, {
                    x: centroidx + w/2 - textw/2,
                    y: centroidy + h/2 - texth/2,
                    size: fontSize,
                })                  
            }
            
            function highestPoint(shape) {
                let geom2 = shapeToGeom2(shape)
                let maxP = [0,0]
                let maxY = -Infinity
                //console.log(maxY, maxP)
                geom2.sides.forEach(([p0, p1]) => {
                    if (p0[1] > maxY) {
                        maxY = p0[1]
                        maxP = p0
                    }
                    if (p1[1] > maxY) {
                        maxY = p1[1]
                        maxP = p1
                    }
                })
                console.log(maxY, maxP)
                return maxP
            }
            
            function lowestPoint(shape) {
                let geom2 = shapeToGeom2(shape)
                let minP = [0,0]
                let minY = +Infinity
                geom2.sides.forEach(([p0, p1]) => {
                    if (p0[1] < minY) {
                        minY = p0[1]
                        minP = p0
                    }
                    if (p1[1] < minY) {
                        minY = p1[1]
                        minP = p1
                    }
                })
                console.log(minY, minP)
                return minP
            }
            
            function rightestPoint(shape) {
                let geom2 = shapeToGeom2(shape)
                let maxP = [0,0]
                let maxX = -Infinity
                geom2.sides.forEach(([p0, p1]) => {
                    if (p0[0] > maxX) {
                        maxX = p0[0]
                        maxP = p0
                    }
                    if (p1[0] > maxX) {
                        maxX = p1[0]
                        maxP = p1
                    }
                })
                console.log(maxX, maxP)
                return maxP
            }
            
            function leftestPoint(shape) {
                let geom2 = shapeToGeom2(shape)
                let minP = [0,0]
                let minX = +Infinity
                geom2.sides.forEach(([p0, p1]) => {
                    if (p0[0] < minX) {
                        minX = p0[0]
                        minP = p0
                    }
                    if (p1[0] < minX) {
                        minX = p1[0]
                        minP = p1
                    }
                })
                console.log(minX, minP)
                return minP
            }
            
            function drawHeightMeasurement(shape) {
                let rightestP = rightestPoint(shape)
                let leftestP = leftestPoint(shape)
                let highestP = highestPoint(shape)
                let lowestP = lowestPoint(shape)
                let midX = (rightestP[0] + leftestP[0]) / 2
                let margin
                let angle
                if (midX > 0) {
                    margin = foam.sizeX/2 + 10
                    angle = -90
                } else {
                    margin = -foam.sizeX/2 - 10
                    angle = 90
                }                
                page.drawLine({
                    start: {x: highestP[0] + w/2, y: highestP[1] + h/2},
                    end: {x: margin + w/2, y: highestP[1] + h/2},
                    opacity: 0.5,
                })
                page.drawLine({
                    start: {x: lowestP[0] + w/2, y: lowestP[1] + h/2},
                    end: {x: margin + w/2, y: lowestP[1] + h/2},
                    opacity: 0.5,
                })
                let midY = (highestP[1] + lowestP[1]) / 2
                let fontSize = 16
                let text = (highestP[1]-lowestP[1]).toFixed(2)
                let textw = font.widthOfTextAtSize(text, fontSize)
                let texth = font.heightAtSize(fontSize)
                //let texth = font.heightOfTextAtSize(text, fontSize)
                page.drawText(text, {
                    x: margin + w/2 - texth/2,
                    y: midY + h/2 - textw/2,
                    size: fontSize,
                    rotate: {angle: angle, type: "degrees"},
                })                                  
            }
            
            function drawWidthMeasurement(shape) {
                let rightestP = rightestPoint(shape)
                let leftestP = leftestPoint(shape)
                let highestP = highestPoint(shape)
                let lowestP = lowestPoint(shape)
                let midY = (highestP[1] + lowestP[1]) / 2
                let margin
                if (midY > 0) {
                    margin = foam.sizeY/2 + 10
                } else {
                    margin = -foam.sizeY/2 - 10
                }
                page.drawLine({
                    start: {x: rightestP[0] + w/2, y: rightestP[1] + h/2},
                    end: {x: rightestP[0] + w/2, y: margin + h/2},
                    opacity: 0.5,
                })
                page.drawLine({
                    start: {x: leftestP[0] + w/2, y: leftestP[1] + h/2},
                    end: {x: leftestP[0] + w/2, y: margin + h/2},
                    opacity: 0.5,
                })
                let midX = (rightestP[0] + leftestP[0]) / 2
                let fontSize = 16
                let text = (rightestP[0]-leftestP[0]).toFixed(2)
                let textw = font.widthOfTextAtSize(text, fontSize)
                let texth = font.heightAtSize(fontSize)
                //let texth = font.heightOfTextAtSize(text, fontSize)
                page.drawText(text, {
                    x: midX + w/2 - textw/2,
                    y: margin + h/2 - texth/2,
                    size: fontSize,                    
                })                           
            }            
            
            let measurements = {
                left: [],
                right: [],
                top: [],
                bottom: [],
            }
            
            // Calculate all the measurements we want for each of the shapes
            shapesArray.forEach((shape) => {
                //console.log("Before shape")
                //console.log(JSON.stringify(measurements))
                // Points
                let l = leftestPoint(shape)
                let r = rightestPoint(shape)
                let t = highestPoint(shape)
                let b = lowestPoint(shape)
                let c = [(l[0] + r[0])/2, (t[1] + b[1])/2]
                // Width measurements
                {
                    let m = {}
                    m.points = [l, r],
                    m.values = [l[0], r[0]]
                    m.magnitude = r[0] - l[0]
                    m.overlaps = []
                    m.type = "width"
                    if (c[1] < 0) {
                        measurements.bottom.push(m)
                        //console.log(measurements);
                        //debugger
                    } else {
                        measurements.top.push(m)
                        //console.log(measurements);
                        //debugger
                    }
                }
                // Height measurements
                {
                    let m = {}
                    m.points = [b, t],
                    m.values = [b[1], t[1]]
                    m.magnitude = t[1] - b[1]
                    m.overlaps = []
                    m.type = "height"
                    //console.log("MEASUREMENT", m)
                    if (c[0] < 0) {
                        measurements.left.push(m)
                        //console.log(measurements);
                        //debugger
                    } else {
                        measurements.right.push(m)
                        //console.log(measurements);
                        //debugger
                    }
                }
                //console.log("After shape")
                //console.log(JSON.stringify(measurements))
            });
            
            //console.log("Before calc overlaps");
            //console.log(JSON.stringify(measurements));
            
            // Calculate overlaps for each group of measurments 
            (["left", "right", "top", "bottom"]).forEach((dir) => {
                //console.log(dir, measurements[dir], measurements)
                for (let m of measurements[dir]) {
                    for (let other of measurements[dir]) {
                        if (m === other) {
                            continue
                        }
                        //console.log(m, other)
                        if (m.values[0] < other.values[1] && m.values[1] > other.values[0]) {
                            m.overlaps.push(other)
                        }
                    }
                }
                //console.log(dir, measurements[dir], measurements)
            });
            
            //console.log("Before split");
            //console.log(JSON.stringify(measurements));
            //console.log(typeof measurements.left[0]);
            
            // Split each group of measurements into non-overlapping sets using DFS
            (["left", "right", "top", "bottom"]).forEach((dir) => {
                let currentSet = []
                let sets = []
                let visited = new Set()
                function dfs(m) {
                    if (visited.has(m))
                        return
                    visited.add(m)
                    currentSet.push(m)
                    for (let next of m.overlaps) {
                        dfs(next)
                    }
                }
                for (let m of measurements[dir]) {
                    dfs(m)
                    
                    // Also sort the set by measurement magnitude (smaller first)
                    currentSet.sort((a, b) => a.magnitude < b.magnitude)
                    
                    if (currentSet.length > 0) {
                        sets.push(currentSet)
                    }
                    currentSet = []
                }
                //console.log("BEFORE", dir, measurements[dir])
                measurements[dir] = sets
                //console.log("AFTER", dir, measurements[dir])
            });           

            //console.log("After split");
            //console.log(JSON.stringify(measurements));
            //console.log(typeof measurements.left[0]);
            
            drawShape(foam)
            shapesArray.forEach((shape) => drawShape(shape))
            shapesArray.forEach((shape) => drawDepthMeasurement(shape))
            // shapesArray.forEach((shape) => drawHeightMeasurement(shape))
            // shapesArray.forEach((shape) => drawWidthMeasurement(shape))

            
            // Draw each set of measurements
        
            measurements.left.forEach((ms) => {
                let margin = -foam.sizeX/2 - 15 
                for (let m of ms) {  
                console.log("MEASUREMENT", m)
                    // Helper lines
                    for (let p of m.points) {
                        page.drawLine({
                            start: {x: p[0] + w/2, y: p[1] + h/2},
                            end: {x: margin + w/2, y: p[1] + h/2},
                            opacity: 0.5,
                        })
                    }
                    page.drawLine({
                        start: {x: margin + 5 + w/2, y: m.points[0][1] + h/2},
                        end: {x: margin + 5 + w/2, y: m.points[1][1] + h/2},
                        opacity: 0.5,
                    })                   
                    let mid = (m.points[0][1] + m.points[1][1]) / 2
                    let fontSize = 16
                    let text = m.magnitude.toFixed(2)
                    let textw = font.widthOfTextAtSize(text, fontSize)
                    let texth = font.heightAtSize(fontSize)
                    page.drawText(text, {
                        x: margin + w/2 - texth/2,
                        y: mid + h/2 - textw/2,
                        size: fontSize,
                        rotate: {angle: 90, type: "degrees"},
                    })   
                    margin -= texth * 2
                }
            })
                    
            measurements.right.forEach((ms) => {
                let margin = foam.sizeX/2 + 15 
                for (let m of ms) {  
                console.log("MEASUREMENT", m)
                    // Helper lines
                    for (let p of m.points) {
                        page.drawLine({
                            start: {x: p[0] + w/2, y: p[1] + h/2},
                            end: {x: margin + w/2, y: p[1] + h/2},
                            opacity: 0.5,
                        })
                    }
                    page.drawLine({
                        start: {x: margin - 5 + w/2, y: m.points[0][1] + h/2},
                        end: {x: margin - 5 + w/2, y: m.points[1][1] + h/2},
                        opacity: 0.5,
                    })                            
                    let mid = (m.points[0][1] + m.points[1][1]) / 2
                    let fontSize = 16
                    let text = m.magnitude.toFixed(2)
                    let textw = font.widthOfTextAtSize(text, fontSize)
                    let texth = font.heightAtSize(fontSize)
                    page.drawText(text, {
                        x: margin + w/2 + texth/2,
                        y: mid + h/2 - textw/2,
                        size: fontSize,
                        rotate: {angle: 90, type: "degrees"},
                    })   
                    margin += texth * 2
                }
            })      

            measurements.top.forEach((ms) => {
                let margin = foam.sizeY/2 + 15 
                for (let m of ms) {  
                console.log("MEASUREMENT", m)
                    // Helper lines
                    for (let p of m.points) {
                        page.drawLine({
                            start: {x: p[0] + w/2, y: p[1] + h/2},
                            end: {x: p[0] + w/2, y: margin + h/2},
                            opacity: 0.5,
                        })
                    }
                    page.drawLine({
                        start: {x: m.points[0][0] + w/2, y: margin - 5 + h/2},
                        end: {x: m.points[1][0] + w/2, y: margin - 5 + h/2},
                        opacity: 0.5,
                    })                   
                    let mid = (m.points[0][0] + m.points[1][0]) / 2
                    let fontSize = 16
                    let text = m.magnitude.toFixed(2)
                    
                    let textw = font.widthOfTextAtSize(text, fontSize)
                    let texth = font.heightAtSize(fontSize)
                    
                    console.log(mid, margin)
                    console.log(text)
                    console.log(textw, texth)
                    
                    page.drawText(text, {
                        x: mid + w/2 - textw/2,
                        y: margin + h/2 + texth/2 - 2,
                        size: fontSize,
                    })   
                    margin += texth * 2
                }
            })      

            measurements.bottom.forEach((ms) => {
                let margin = -foam.sizeY/2 - 15 
                for (let m of ms) {  
                console.log("MEASUREMENT", m)
                    // Helper lines
                    for (let p of m.points) {
                        page.drawLine({
                            start: {x: p[0] + w/2, y: p[1] + h/2},
                            end: {x: p[0] + w/2, y: margin + h/2},
                            opacity: 0.5,
                        })
                    }
                    page.drawLine({
                        start: {x: m.points[0][0] + w/2, y: margin + 5 + h/2},
                        end: {x: m.points[1][0] + w/2, y: margin + 5 + h/2},
                        opacity: 0.5,
                    })                   
                    let mid = (m.points[0][0] + m.points[1][0]) / 2
                    let fontSize = 16
                    let text = m.magnitude.toFixed(2)
                    
                    let textw = font.widthOfTextAtSize(text, fontSize)
                    let texth = font.heightAtSize(fontSize)
                    
                    console.log(mid, margin)
                    console.log(text)
                    console.log(textw, texth)
                    
                    page.drawText(text, {
                        x: mid + w/2 - textw/2,
                        y: margin + h/2 - texth/2,
                        size: fontSize,
                    })   
                    margin -= texth * 2
                }
            })             

            //return pdf.save()
        //}).then((bytes) => {
            
            let bytes = await pdf.save()
            
            //console.log(bytes)
            let link = document.createElement("a")
            let blob = new Blob([bytes], {type: "application/pdf"})
            //console.log(blob)
            let url = URL.createObjectURL(blob)
            console.log(url)
            link.href = url
            link.setAttribute('download', 'test.pdf')
            link.click()
        //})
    }
}

/*
// array of coordinates of each vertex of the polygon
var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
pointInsidePolygon([ 1.5, 1.5 ], polygon); // true
*/
function pointInsidePolygon(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

/* Geometry generation from shape data */

function shapeToGeom2(shape) {
   switch (shape.kind) {
      case "circle":
          return jscad.primitives.circle({
             center: [shape.x, shape.y],
             radius: shape.radius,
             segments: 20,
          })
      case "rectangle":
          let rect = jscad.primitives.rectangle({
             center: [shape.x, shape.y],
             size: [shape.sizeX, shape.sizeY],
          })
          for (let side of rect.sides) {
              for (let vert of side) {  
                jscad.maths.vec2.rotate(vert, vert, [shape.x, shape.y], jscad.utils.degToRad(shape.rotation))
              }
          }
          return rect
      case "photoshape":
        let polygon = shape.polygon.map(([x, y]) => [x, y]).map(v => jscad.maths.vec2.rotate(v, v, [0, 0], jscad.utils.degToRad(shape.rotation)))
        polygon = polygon.map(([x, y]) => [x + shape.x, y + shape.y])
        return jscad.geometries.geom2.fromPoints(polygon)
   }
}

export function shapeToGeom3(shape) {
   let geom2 = shapeToGeom2(shape);
   return jscad.extrusions.extrudeLinear({
      height: shape.sizeZ
   }, geom2)
}

function geom2ToLineSegments(geom2) {
   let positions = [];
   for (let line of geom2.sides) {
      for (let vertex of line) {
         positions.push(vertex[0]);
         positions.push(vertex[1]);
         positions.push(0);
      }
   }  
   let geo = new THREE.BufferGeometry();
   geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3, false));
   return new THREE.LineSegments(geo, new THREE.LineBasicMaterial());
}

function geom2ToMesh(geom2) {
   let positions = [];
   for (let line of geom2.sides) {
      for (let vertex of line) {
         positions.push(vertex[0]);
         positions.push(vertex[1]);
         positions.push(0);
      }
   }  
   let indices = earcut(positions, [], 3);
   let geo = new THREE.BufferGeometry();
   geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3, false));
   geo.setIndex(indices);
   geo.computeVertexNormals();
   return new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
}

// Selectively smooth normals
function smoothNormals(points) {
   // Triangle count
   let n = points.length / 3; 

   // Calculate face normals for each vertex
   let faceNormals = [];
   for (let i=0; i<n; i++) {
      let p0 = points[i*3+0]
      let p1 = points[i*3+1]
      let p2 = points[i*3+2]
      let normal = new THREE.Vector3().crossVectors(
         new THREE.Vector3().subVectors(p1, p0),
         new THREE.Vector3().subVectors(p2, p0),
      );
      faceNormals.push(normal, normal, normal)
   }

   // Calculate face normal weights for each vertex
   // (https://stackoverflow.com/a/45496726)
   let faceNormalWeights = [];
   for (let i=0; i<n; i++) {
      let p0 = points[i*3+0]
      let p1 = points[i*3+1]
      let p2 = points[i*3+2]
      let a0 = new THREE.Vector3().subVectors(p1, p0).angleTo(new THREE.Vector3().subVectors(p2, p0));
      let a1 = new THREE.Vector3().subVectors(p2, p1).angleTo(new THREE.Vector3().subVectors(p0, p1));
      let a2 = new THREE.Vector3().subVectors(p0, p2).angleTo(new THREE.Vector3().subVectors(p1, p2));
      faceNormalWeights.push(a0, a1, a2);
   }

   // For each vertex store list of normals to later average
   let smoothNormals = [];
   for (let i=0; i<n*3; i++) {
      smoothNormals.push([faceNormals[i].clone().multiplyScalar(faceNormalWeights[i])])
   }

   // For every pair of vertices
   for (let i=0; i<n*3-1; i++) {
      for (let j=i+1; j<n*3; j++) {
         // Skip if angle between their faces too big
         let angleLimit = 30
         if (faceNormals[i].clone().normalize().dot(faceNormals[j].clone().normalize()) < Math.cos(THREE.MathUtils.degToRad(angleLimit))) {
            continue
         }
         // Skip if not same position
         if (points[i].distanceTo(points[j]) > 0.001) {
            continue
         }
         // Add the face normal of one to the smooth list of the other
         smoothNormals[i].push(faceNormals[j].clone().multiplyScalar(faceNormalWeights[j]))
         smoothNormals[j].push(faceNormals[i].clone().multiplyScalar(faceNormalWeights[i]))
      }
   }

   // Add up and normalize the normals from the smooth lists
   return smoothNormals.map((ns) => {
      let nn = new THREE.Vector3(0,0,0)
      ns.forEach((n) => nn.add(n))
      nn = nn.normalize()
      return nn
   })
}

function geom3ToMesh(geom3) {
   geom3 = jscad.modifiers.generalize({
      triangulate: true
   }, geom3)
   
   let points = [];
   let normals = [];
   for (let triangle of geom3.polygons) {
      let p0 = new THREE.Vector3(...triangle.vertices[0])
      let p1 = new THREE.Vector3(...triangle.vertices[1])
      let p2 = new THREE.Vector3(...triangle.vertices[2])
      let normal = new THREE.Vector3().crossVectors(
         new THREE.Vector3().subVectors(p1, p0),
         new THREE.Vector3().subVectors(p2, p0),
      );
      if (normal.lengthSq() > 0.001) {
         normal = normal.normalize()
      }
      points.push(p0, p1, p2);      
      normals.push(normal, normal, normal);
   }

   // slow
   //normals = smoothNormals(points);

   let flatNormals = [];
   for (let normal of normals) {
      flatNormals.push(...normal.toArray());
   }

   let geo = new THREE.BufferGeometry()
   geo.setFromPoints(points);
   geo.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(flatNormals), 3, false));
   return new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
}

/* Shaders */

class LambertMaterial extends THREE.ShaderMaterial {
   constructor(color) {
      color = new THREE.Color(color)
      super({
         vertexShader:`
            varying vec3 vViewPosition;
            varying vec3 vViewNormal;

            void main() {
               vViewPosition = vec3(modelViewMatrix * vec4(position, 1.0));
               vViewNormal = normalMatrix * normal;
               gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
         `,
         fragmentShader:`
            varying vec3 vViewPosition;
            varying vec3 vViewNormal;
            uniform vec3 color;

            void main() {
               float factor = dot(-normalize(vViewPosition), normalize(vViewNormal));
               float minLight = 0.1;
               factor = factor*(1.0-minLight) + (minLight);
               
               gl_FragColor.rgb = color.rgb;
               gl_FragColor.rgb *= factor;
               gl_FragColor.a = 1.0;
            }
         `,
         uniforms: {
            color: { value: new THREE.Vector3(color.r, color.g, color.b) }
         }
      })
   }
}

class FoamMaterial extends THREE.ShaderMaterial {
   constructor(color, topLayerColor, topLayerThickness, foamHeight) {
      color = new THREE.Color(color)
      topLayerColor = new THREE.Color(topLayerColor)
      super({
         vertexShader:`
            varying vec3 vWorldPosition;
            varying vec3 vViewPosition;
            varying vec3 vViewNormal;

            void main() {
               vWorldPosition = vec3(modelMatrix * vec4(position, 1.0));
               vViewPosition = vec3(modelViewMatrix * vec4(position, 1.0));
               vViewNormal = normalMatrix * normal;
               gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
         `,
         fragmentShader:`
            varying vec3 vWorldPosition;
            varying vec3 vViewPosition;
            varying vec3 vViewNormal;
            uniform vec3 color;
            uniform vec3 topLayerColor;
            uniform float topLayerThickness;
            uniform float foamHeight;

            void main() {
               float lambertFactor = dot(-normalize(vViewPosition), normalize(vViewNormal));
               float heightFactor = vWorldPosition.z / foamHeight;
               float factor = lambertFactor * heightFactor;
               float minLight = 0.1;
               factor = factor*(1.0-minLight) + (minLight);
               
               if (vWorldPosition.z < foamHeight - topLayerThickness) {
                  gl_FragColor.rgb = color.rgb;
               } else {
                  gl_FragColor.rgb = topLayerColor.rgb;
               }

               gl_FragColor.rgb *= factor;
               gl_FragColor.a = 1.0;
            }
         `,
         uniforms: {
            color: { value: new THREE.Vector3(color.r, color.g, color.b) },
            topLayerColor: { value: new THREE.Vector3(topLayerColor.r, topLayerColor.g, topLayerColor.b) },
            topLayerThickness: { value: topLayerThickness },
            foamHeight: { value: foamHeight },
         }
      })
   }
}

/* 3D */

let renderer
let overlayCanvas
let ctx
let ssaaRenderTarget
let scene
let camera
let controls
let millimeters = 1;
let centimeters = 10*millimeters;
let meters = 100*centimeters;
let mouseX = 0
let mouseY = 0
let mouseNdcX = 0
let mouseNdcY = 0
let mouseRayPlaneIntersection = null;
let selected = null
let oldSelected = null
let dragOffset = null;
let dragging = false
let dragged = false
let postScene
let postCamera
let postQuad

function mouseOverShape(shape) {
    if (shape.kind=="circle") {
      let shapeCenter=new THREE.Vector2(shape.x, shape.y)
      if (shapeCenter.distanceTo(mouseRayPlaneIntersection) < shape.radius) {
        return true
      }
    } else if (shape.kind=="rectangle") {
        let shapeBox = new THREE.Box2(new THREE.Vector2(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2), new THREE.Vector2(shape.x + shape.sizeX/2, shape.y + shape.sizeY/2));
        let v = mouseRayPlaneIntersection
        v = v.clone()
        v = v.rotateAround(new THREE.Vector2(shape.x, shape.y), jscad.utils.degToRad(-shape.rotation))
        if (shapeBox.containsPoint(v)) {
            return true                  
        }
    } else if (shape.kind=="photoshape") {
        let v = mouseRayPlaneIntersection
        let polygon = shape.polygon.map(([x, y]) => [x, y]).map(v => jscad.maths.vec2.rotate(v, v, [0, 0], jscad.utils.degToRad(shape.rotation)))
        polygon = polygon.map(([x, y]) => [x + shape.x, y + shape.y])
        return pointInsidePolygon([v.x, v.y], polygon)
    }
    return false
}

function shapeUnderMouse() {
    if (mouseRayPlaneIntersection) {
        for (let shape of shapesArray.slice().reverse()) {
            if (mouseOverShape(shape)) {
                return shape
            }
        }
    }    
    return null
}

function init3D() {
    renderer = new THREE.WebGL1Renderer({
      antialias: true,
      precision: "highp",
    })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.autoClear = false;

    overlayCanvas = document.createElement("canvas");
    ctx = overlayCanvas.getContext("2d");

    ssaaRenderTarget = new THREE.WebGLRenderTarget()
    ssaaRenderTarget.texture.minFilter = THREE.LinearFilter;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1*millimeters, 100*meters);
    camera.position.set(0, -1*meters, 1.5*meters);
    camera.up.set(0, 0, 1);

    controls = new OrbitControls.OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0,37*centimeters)
    controls.update();
    controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN; 
    controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
    }
    //controls.screenSpacePanning = false
    //controls.enableZoom = false

    window.addEventListener('resize', onResize);
    onResize();
    
    renderer.domElement.style.position = "fixed";
    /*
    renderer.domElement.style.left = "0";
    renderer.domElement.style.right = "0";
    renderer.domElement.style.bottom = "0";
    renderer.domElement.style.top = "0";
    */
    renderer.domElement.style.width = window.innerWidth + "px"
    renderer.domElement.style.height = window.innerHeight + "px"
    overlayCanvas.style.position = "fixed";
    /*
    overlayCanvas.style.left = "0";
    overlayCanvas.style.right = "0";
    overlayCanvas.style.bottom = "0";
    overlayCanvas.style.top = "0";
    */
    overlayCanvas.style.width = window.innerWidth + "px"
    overlayCanvas.style.height = window.innerHeight + "px"
    overlayCanvas.style.pointerEvents = "none";
        
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(overlayCanvas);
    
    doCsg()

    function recalculateMouse(e) {
      mouseX = e.clientX * (window.devicePixelRatio || 1)
      mouseY = e.clientY * (window.devicePixelRatio || 1)  
      mouseNdcX = (mouseX / renderer.domElement.width - 0.5) * 2
      mouseNdcY = -((mouseY / renderer.domElement.height - 0.5) * 2) 

      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({x: mouseNdcX, y: mouseNdcY}, camera);
      let ray = raycaster.ray;
      let foamPlane = new THREE.Plane(new THREE.Vector3(0,0,1), -37*centimeters)
      let intersection = ray.intersectPlane(foamPlane, new THREE.Vector3())
      if (intersection) {
        mouseRayPlaneIntersection = new THREE.Vector2(intersection.x, intersection.y)
        if (dragging && selected) {
          dragged = true
          selected.x = mouseRayPlaneIntersection.x - dragOffset.x
          selected.y = mouseRayPlaneIntersection.y - dragOffset.y
          doCsg()
        }
      } else {
        mouseRayPlaneIntersection = null
        dragging = false
      }      
    }

    renderer.domElement.addEventListener("pointermove", (e) => {
      recalculateMouse(e)
    })

    renderer.domElement.addEventListener("pointerdown", (e) => {
        recalculateMouse(e)
        e.preventDefault();
        oldSelected = selected
        if (selected && mouseOverShape(selected)) {
            dragging = true
            dragged = false
            dragOffset = new THREE.Vector2().subVectors(mouseRayPlaneIntersection, new THREE.Vector2(selected.x, selected.y));
            controls.enabled = false
            return
        }
        selected = shapeUnderMouse()
        if (selected) {
            document.querySelector("#back-button").removeAttribute("disabled");
            document.querySelector("#back-button").onclick = () => {
               document.querySelector("#back-button").setAttribute("disabled", "");
               showPanelFromLeft("main-panel")
               selected = null
            }                  
            showPanelFromRight(selected.kind+"-panel")
            
            dragging = true
            dragged = false
            dragOffset = new THREE.Vector2().subVectors(mouseRayPlaneIntersection, new THREE.Vector2(selected.x, selected.y));
            controls.enabled = false
        } else {
            /*
          document.querySelector("#back-button").setAttribute("disabled", "");
          showPanelFromLeft("main-panel")                              
            */
            selected = oldSelected
        }
    })
    
    renderer.domElement.addEventListener("pointerup", (e) => {
        console.log(dragging, dragged, shapesArray.indexOf(selected), shapesArray.indexOf(oldSelected))
        if (dragging) {
            if (dragged) {
                commit()
            }
            if (selected) {
                shapesArray.splice(shapesArray.indexOf(selected), 1)                
                if (!dragged && (selected === oldSelected)) {
                    shapesArray.unshift(selected)
                    selected = shapeUnderMouse()
                    document.querySelector("#back-button").removeAttribute("disabled");
                    document.querySelector("#back-button").onclick = () => {
                       document.querySelector("#back-button").setAttribute("disabled", "");
                       showPanelFromLeft("main-panel")
                       selected = null
                    }                  
                    showPanelFromRight(selected.kind+"-panel")                
                } else {
                    shapesArray.push(selected)
                }
            }
            dragging = false
            controls.enabled = true
        }
    })

    let ground = new THREE.Mesh(new THREE.PlaneGeometry(100*meters, 100*meters, 1, 1), new LambertMaterial("white"));
    scene.add(ground);

    //fetch(case1Url).then((response)=>response.text()).then((text)=>console.log(text))
    let loader = new OBJLoader.OBJLoader();
    loader.load(case1Url, (group) => {
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          let mesh = object;
          mesh.material = new LambertMaterial("cadetblue");
        }
      })
      let caseModel = scene.getObjectByName("caseModel");
      if (caseModel) {
        scene.remove(caseModel)
      }
      group.name = "caseModel";
      scene.add(group);
    });

    postScene = new THREE.Scene()
    postCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
    postQuad = new THREE.Mesh(new THREE.PlaneGeometry( 2, 2, 1, 1 ), new THREE.MeshBasicMaterial({map:ssaaRenderTarget.texture}) );
    postScene.add( postQuad );    
    
    window.requestAnimationFrame(onFrame)
    onFrame();    
}

function onResize() {
    overlayCanvas.style.width = window.innerWidth + "px";
    overlayCanvas.style.height = window.innerHeight + "px";
    overlayCanvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    overlayCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    ssaaRenderTarget.setSize(window.innerWidth*2, window.innerHeight*2);
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function project(p0, camera) {
    return p0.project(camera).multiply(new THREE.Vector3(1,-1,1)).addScalar(1.0).multiplyScalar(0.5).multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1))    
}

/*
function draw3dLine(p0, p1, camera) {
    let p0_ = p0.project(camera).multiply(new THREE.Vector3(1,-1,1)).addScalar(1.0).multiplyScalar(0.5).multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1))
    let p1_ = p1.project(camera).multiply(new THREE.Vector3(1,-1,1)).addScalar(1.0).multiplyScalar(0.5).multiply(new THREE.Vector3(ctx.canvas.width, ctx.canvas.height, 1))
    ctx.moveTo(p0_.x, p0_.y);
    ctx.lineTo(p1_.x, p1_.y);
    ctx.stroke()
}
*/

let foam = {
    kind: "rectangle",
    x:0,
    y:0,
    sizeX:70*centimeters,
    sizeY:50*centimeters,
    sizeZ:37*centimeters,
    rotation:0,
}

let shapesArray = [{
    kind: "circle",
    x:0,
    y:0,
    sizeZ:25*centimeters,
    radius:10*centimeters,
}]
let worker = null; 

let undoRedoHistory = []
let undoRedoPosition = 0

function commit() {
    if (undoRedoPosition != undoRedoHistory.length - 1) {
        undoRedoHistory.splice(undoRedoPosition + 1)
    }
    undoRedoHistory.push(structuredClone(shapesArray))
    undoRedoPosition = undoRedoHistory.length - 1;
    updateUndoRedoButtons()
}

function structuredClone(val) {
    let str = JSON.stringify(val)
    console.log(str)
    return JSON.parse(str)
}

function undo() {
    if (undoRedoPosition > 0) {
        undoRedoPosition -= 1
        shapesArray = structuredClone(undoRedoHistory[undoRedoPosition])
        doCsg()
    }
    updateUndoRedoButtons()
   document.querySelector("#back-button").setAttribute("disabled", "");
   showPanelFromLeft("main-panel")
   selected = null    
}

function redo() {
    if (undoRedoPosition < undoRedoHistory.length - 1) {
        undoRedoPosition += 1
        shapesArray = structuredClone(undoRedoHistory[undoRedoPosition])
        doCsg()
    }
    updateUndoRedoButtons()
   document.querySelector("#back-button").setAttribute("disabled", "");
   showPanelFromLeft("main-panel")
   selected = null    
    
}

function updateUndoRedoButtons() {
    if (undoRedoPosition > 0) {
        document.querySelector("#undo-button").removeAttribute("disabled");    
    } else {
        document.querySelector("#undo-button").setAttribute("disabled", "");    
    }
    if (undoRedoPosition < undoRedoHistory.length - 1) {
        document.querySelector("#redo-button").removeAttribute("disabled");    
    } else {
        document.querySelector("#redo-button").setAttribute("disabled", "");    
    }
}

function doCsg() {
    if (worker) {
        worker.terminate();    
    }
    worker = new Worker(new URL("./csg.js", import.meta.url), {type: "module"});
    worker.onmessage = (e) => {
        let csgModel = scene.getObjectByName("csgModel")
        if (csgModel) {
            if (csgModel instanceof THREE.Mesh) {
                csgModel.geometry.dispose()
            }
            scene.remove(csgModel);
        }
        let mesh = geom3ToMesh(e.data);
        mesh.material = new FoamMaterial("red", "#333", 2*centimeters, 37*centimeters);
        mesh.name = "csgModel";
        scene.add(mesh)
    }
    worker.postMessage({foam,shapesArray:shapesArray});  
}

function drawOutline(shape, style, width, z) {
    ctx.lineWidth = width;
    ctx.strokeStyle = style;
    
    let geom2 = shapeToGeom2(shape)
    ctx.beginPath();
    let line = geom2.sides[0]
    let p0 = project(new THREE.Vector3(line[0][0], line[0][1], z), camera)
    ctx.moveTo(p0.x, p0.y)             
    for (let line of geom2.sides) {      
      let p1 = project(new THREE.Vector3(line[0][0], line[0][1], z), camera)
      ctx.lineTo(p1.x, p1.y)
    }    
    ctx.lineTo(p0.x, p0.y)
    ctx.stroke()
}

function drawMeasurements(shape) {
    ctx.lineWidth = 1
    switch(shape.kind) {
        case "circle": drawMeasurementsCircle(shape); break;
        case "rectangle": drawMeasurementsRectangle(shape); break;
        case "photoshape": drawMeasurementsPhotoshape(shape); break;
    }   
    
    /*
    let p0 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)
    
    ctx.font = "bold " + (20 * window.devicePixelRatio) + "px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(shapesArray.indexOf(shape), p0.x, p0.y)
    ctx.strokeStyle = "black";
    ctx.strokeText(shapesArray.indexOf(shape), p0.x, p0.y)        
    ctx.strokeStyle = "orange";
        
    ctx.beginPath();
    ctx.arc(p0.x, p0.y, 4, 0, 2*Math.PI);
    ctx.fill();      
    */
}

function drawMeasurementsPhotoshape(shape) {
    ctx.fillStyle = "orange";
    
    
    function transform(v, camera){
        return project(v.sub(new THREE.Vector3(shape.x, shape.y, 0)).applyAxisAngle(new THREE.Vector3(0,0,1), jscad.utils.degToRad(shape.rotation)).add(new THREE.Vector3(shape.x, shape.y, 0)), camera)
    }

    // depth line
    if (currPanel.id.endsWith("-depth-panel"))
    {        
        ctx.beginPath();
        let p0 = transform(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)
        let p1 = transform(new THREE.Vector3(shape.x, shape.y, 37*centimeters-shape.sizeZ), camera)
        ctx.moveTo(p0.x, p0.y)             
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
       
    }

    // depth text
    if (currPanel.id.endsWith("-depth-panel"))
    {
        let p0 = transform(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)
        let p1 = transform(new THREE.Vector3(shape.x, shape.y, 37*centimeters-shape.sizeZ), camera)
        let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2)
        ctx.font = "bold " + (20 * window.devicePixelRatio) + "px sans-serif";
        
        ctx.textAlign = "left";
        ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y)
        ctx.strokeStyle = "black";
        ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y)        
        ctx.strokeStyle = "orange";        
    }       
}

function drawMeasurementsRectangle(shape) {
    ctx.fillStyle = "orange";
    
    
    function transform(v, camera){
        return project(v.sub(new THREE.Vector3(shape.x, shape.y, 0)).applyAxisAngle(new THREE.Vector3(0,0,1), jscad.utils.degToRad(shape.rotation)).add(new THREE.Vector3(shape.x, shape.y, 0)), camera)
    }

    // depth line
    if (currPanel.id.endsWith("-depth-panel"))
    {        
        ctx.beginPath();
        let p0 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters), camera)
        let p1 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters-shape.sizeZ), camera)
        ctx.moveTo(p0.x, p0.y)             
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
       
    }
    // width line
    if (currPanel.id.endsWith("-resize-panel"))
    {        
        ctx.beginPath();
        let p0 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters), camera)
        let p1 = transform(new THREE.Vector3(shape.x + shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters), camera)
        ctx.moveTo(p0.x, p0.y)                     
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()

    }
    // height line
    if (currPanel.id.endsWith("-resize-panel"))
    {        
        ctx.beginPath();
        let p0 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters), camera)
        let p1 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y + shape.sizeY/2, 37*centimeters), camera)
        ctx.moveTo(p0.x, p0.y)             
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()

    }    
    
    // depth text
    if (currPanel.id.endsWith("-depth-panel"))
    {
        let p0 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters), camera)
        let p1 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters-shape.sizeZ), camera)
        let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2)
        ctx.font = "bold " + (20 * window.devicePixelRatio) + "px sans-serif";
        
        ctx.textAlign = "left";
        ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y)
        ctx.strokeStyle = "black";
        ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y)        
        ctx.strokeStyle = "orange";        
    }   
    // width text
    if (currPanel.id.endsWith("-resize-panel"))
    {
        let p0 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters), camera)
        let p1 = transform(new THREE.Vector3(shape.x + shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters), camera)
        let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2)
        ctx.font = "bold " + (20 * window.devicePixelRatio) + "px sans-serif";
        
        ctx.textAlign = "left";
        ctx.fillText(shape.sizeX.toFixed(0) + "mm", pMid.x, pMid.y)
        ctx.strokeStyle = "black";
        ctx.strokeText(shape.sizeX.toFixed(0) + "mm", pMid.x, pMid.y)        
        ctx.strokeStyle = "orange";        
    }      
    // height text
    if (currPanel.id.endsWith("-resize-panel"))
    {
        let p0 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y - shape.sizeY/2, 37*centimeters), camera)
        let p1 = transform(new THREE.Vector3(shape.x - shape.sizeX/2, shape.y + shape.sizeY/2, 37*centimeters), camera)
        let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2)
        ctx.font = "bold " + (20 * window.devicePixelRatio) + "px sans-serif";
        
        ctx.textAlign = "left";
        ctx.fillText(shape.sizeY.toFixed(0) + "mm", pMid.x, pMid.y)
        ctx.strokeStyle = "black";
        ctx.strokeText(shape.sizeY.toFixed(0) + "mm", pMid.x, pMid.y)        
        ctx.strokeStyle = "orange";        
    }      
}

function drawMeasurementsCircle(shape) {
    ctx.fillStyle = "orange";

    // points
    {
        let p0 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)
        let p1 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters-shape.sizeZ), camera)
        let p2 = project(new THREE.Vector3(shape.x + shape.radius, shape.y, 37*centimeters), camera)
        
        if (currPanel.id.endsWith("radius-panel") || currPanel.id.endsWith("depth-panel")) {
            ctx.beginPath();
            ctx.arc(p0.x, p0.y, 4, 0, 2*Math.PI);
            ctx.fill();    
        }
        if (currPanel.id.endsWith("depth-panel")) {
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, 4, 0, 2*Math.PI);
            ctx.fill();    
        }
        if (currPanel.id.endsWith("radius-panel")) {
            ctx.beginPath();
            ctx.arc(p2.x, p2.y, 4, 0, 2*Math.PI);
            ctx.fill();    
        }
    }

    // depth line
    if (currPanel.id.endsWith("depth-panel"))
    {        
        ctx.beginPath();
        let p0 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)
        ctx.moveTo(p0.x, p0.y)             
        let p1 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters-shape.sizeZ), camera)
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()
       
    }
    // radius line
    if (currPanel.id.endsWith("radius-panel"))
    {        
        ctx.beginPath();
        let p0 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)
        ctx.moveTo(p0.x, p0.y)             
        let p1 = project(new THREE.Vector3(shape.x + shape.radius, shape.y, 37*centimeters), camera)
        ctx.lineTo(p1.x, p1.y)
        ctx.stroke()

    }
    
    // depth text
    if (currPanel.id.endsWith("depth-panel"))
    {
        let p0 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)
        let p1 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters-shape.sizeZ), camera)        
        let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2)
        ctx.font = "bold " + (20 * window.devicePixelRatio) + "px sans-serif";
        console.log("bold " + (20 * window.devicePixelRatio) + "px sans-serif")
        
        ctx.textAlign = "left";
        ctx.fillText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y)
        ctx.strokeStyle = "black";
        ctx.strokeText(shape.sizeZ.toFixed(0) + "mm", pMid.x, pMid.y)        
        ctx.strokeStyle = "orange";        
    }
    
    // radius text
    if (currPanel.id.endsWith("radius-panel"))
    {
        let p0 = project(new THREE.Vector3(shape.x, shape.y, 37*centimeters), camera)        
        let p1 = project(new THREE.Vector3(shape.x + shape.radius, shape.y, 37*centimeters), camera)
        let pMid = new THREE.Vector3().addVectors(p0, p1).divideScalar(2)
        ctx.font = "bold " + (20 * window.devicePixelRatio) + "px sans-serif";
        
        ctx.textAlign = "center";
        ctx.fillText(shape.radius.toFixed(0) + "mm", pMid.x, pMid.y)        
        ctx.strokeStyle = "black";
        ctx.strokeText(shape.radius.toFixed(0) + "mm", pMid.x, pMid.y)    
        ctx.strokeStyle = "orange";        
    }
       
}

function onFrame() {
  ctx.canvas.width = ctx.canvas.width;
  ctx.canvas.height = ctx.canvas.height;
  ctx.strokeStyle = "orange"
  //renderer.setRenderTarget(ssaaRenderTarget);
  renderer.clear(true);
  renderer.render(scene, camera);
  for (let shape of shapesArray) {
    let geom2 = shapeToGeom2(shape)
    let geom3 = shapeToGeom3(shape)
    if (selected === shape) {
        drawOutline(shape, "orange", 3, 37*centimeters);
        if (currPanel.id.endsWith("depth-panel")) {
            ctx.setLineDash([5, 5]);
            drawOutline(shape, "orange", 1, 37*centimeters - shape.sizeZ);
            ctx.setLineDash([]);
         }
        drawMeasurements(shape)
        let panel = geom2ToMesh(geom2);
        panel.position.set(0,0,37*centimeters);
        panel.material = new THREE.MeshBasicMaterial({color: "orange", opacity: 0.2, transparent: true, depthTest:false});
        renderer.render(panel, camera);
        panel.geometry.dispose();
        if (currPanel.id.endsWith("depth-panel")) {
            let body = geom3ToMesh(geom3);
            body.position.set(0,0,37*centimeters-shape.sizeZ);
            body.material = new THREE.MeshBasicMaterial({color: "orange", opacity: 0.1, transparent: true, depthTest:false});
            renderer.render(body, camera);
            body.geometry.dispose();
        }
    } else {
        ctx.setLineDash([5, 5]);        
        drawOutline(shape, "gray", 1, 37*centimeters);
        ctx.setLineDash([]);      
    }
  }
  /*
  if (selected === null) {
  for (let shape of shapesArray) {
    let geom2 = shapeToGeom2(shape)
    let geom3 = shapeToGeom3(shape)
    ctx.setLineDash([5, 5]);        
    drawOutline(shape, "gray", 1, 37*centimeters);
    ctx.setLineDash([]);  
  }
  }
  */
  //renderer.setRenderTarget(null);
  //renderer.render(postScene, postCamera)
  window.requestAnimationFrame(onFrame)
}

if (typeof window === 'object') {
    initUI();
    init3D();
    commit();
}

export {}
