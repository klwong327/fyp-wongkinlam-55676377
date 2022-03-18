import Oviz from "crux"
import template from "./template.bvt"
import { registerEditorConfig } from "utils/editor"
import { editorConfig, editorRef } from "./editor";
import {register} from "page/visualizers";

const MODULE_NAME = "label-heatmap";

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
        template,
        loadData: { 
            heatDataMain: { 
                fileKey: "lhMain",
                type: "csv",
                loaded(data){
                    let categoryNames = [];
                    let y_axis = []
                    for (var i = 0; i < data.length; i++){
                        const d_num = data[i]
                        y_axis.push(d_num[Object.keys(d_num)[0]])
                    }
                    let x_axis = []
                    for (var i = 1; i < data.columns.length; i++){
                        x_axis.push(data.columns[i])
                    }
    
                    let heatData = []
                    data.forEach(n => {
                        heatData.push(Object.values(n))
                    });

                    const heatData2 = heatData.map(function(val){
                        return val.slice(1,data.columns.length);
                    });
    
                    for(var i = 0; i < heatData2.length; i++){
                        categoryNames = categoryNames.concat(heatData2[i]);
                    }

                    categoryNames = [...new Set(categoryNames)];
                    const colors = Oviz.color.schemeCategory("dark", categoryNames);
                    return {heatData2, x_axis, y_axis, colors};
                }
            },
        },
        setup() {
            registerEditorConfig(editorConfig(this));
        },
    });
    return visualizer;
}
        export function registerlabelheatmap(){
            register(MODULE_NAME, init);
        }
register(MODULE_NAME, init)