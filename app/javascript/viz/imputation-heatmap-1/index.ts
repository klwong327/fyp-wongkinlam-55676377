import Oviz from "crux"
//import * as clusterfck from "clusterfck"
//import * as mathjs from "mathjs"
import template from "./template.bvt"
import { registerEditorConfig } from "utils/editor";
//import {parseNewick} from "crux/dist/utils/newick"
import { editorConfig, editorRef } from "./editor";
import {register} from "page/visualizers";

const MODULE_NAME = "imputation-heatmap-1";

const title = "Raw Data"
const rLabel = "Before DeepMF"
const pLabel = "After DeepMF"
const startColor = "#d83228";
const endColor = "#4777b5";
const yAxisIndices = [1, 2, 3];

//const treeHeight = 400;
//const treeWidth = 350;

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
    el: "#canvas",
    template,
    data: {startColor, endColor, title, rLabel, pLabel},
    //data: {startColor, endColor, treeHeight, treeWidth},
    
    loadData: {
        //Raw data
        raw: {
            fileKey: "ihRaw",
            type: "csv",
            dsvHasHeader: false,
            loaded(data) {
                const heatData = [];
                let max = 0;                
                
                data.forEach(n => {
                    heatData.push(Object.values(n).map(Number))
                });
                console.log("Original HeatData")
                console.log(heatData)

                heatData.forEach(d => {
                    const temp = Math.max(...d);
                    if (temp > max) {
                        max = temp;
                    }
                })
                return {heatData, max}
            },
        },

        //Pred data
        pred: {
            fileKey: "ihPred",
            type: "csv",
            dsvHasHeader: false,
            loaded(data) {
                const heatData = [];
                //let max = 0;                
                
                data.forEach(n => {
                    heatData.push(Object.values(n).map(Number))
                });
                console.log("Original HeatData")
                console.log(heatData)
                return heatData;
                //return {heatData, max}
            },
        },

        //u data
        datum: {
            fileKey: "ihU",
            type: "csv",
            loaded(data) {
                const catetgories = yAxisIndices.map((y) => data.columns[y]);
                const colors = Oviz.color.schemeCategory("light", catetgories);
                const lineDatum = catetgories.map((c, index) => ({ key: c, values: [], color: colors.get(c) }));
                data.forEach((d, index) => {
                    lineDatum.forEach((l) => {
                        l.values.push([index, parseFloat(d[l.key])]);
                    });
                });
                const returned = {};
                lineDatum.forEach((ld, index) => {
                    returned[`data${index}`] = ld;
                });
                return returned;
            },
        },

    },

    

    setup() {
        registerEditorConfig(editorConfig(this));
        //this.defineGradient("bg", "vertical", [startColor, endColor]);
        //const chartWidth = (this.size.width - 100) * 0.8;
        // console.log(this.size.width)
        //const chartHeight = (this.size.height - 100) * 0.05;
        const legendWidth = (this.size.width - 100) * 0.03;
        //this.data.chartWidth = chartWidth;
        //this.data.chartHeight = chartHeight;
        this.data.legendWidth = legendWidth;
    },
    });

    return visualizer;
}

        export function registerimputationheatmap1(){
            register(MODULE_NAME, init);
        }

register(MODULE_NAME, init)