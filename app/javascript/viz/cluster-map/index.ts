import Oviz from "crux"
import * as clusterfck from "clusterfck"
import * as mathjs from "mathjs"
import template from "./template.bvt"
import { registerEditorConfig } from "utils/editor";
import {parseNewick} from "crux/dist/utils/newick"
import { editorConfig, editorRef } from "./editor";

import {register} from "page/visualizers";

const MODULE_NAME = "cluster-map";

const startColor = "#d83228";
const endColor = "#4777b5";
const treeHeight = 400;
const treeWidth = 350;

function init() {
    if (!window.gon || window.gon.module_name !== MODULE_NAME) return;

    const {visualizer} = Oviz.visualize({
        el: "#canvas",
    template,
    data: {startColor, endColor, treeHeight, treeWidth},
    
    loadData: {
        
        result: {
            fileKey: "cmMain",
            type: "csv",
            dsvHasHeader: false,
            loaded(data) {
                const heatData = [];
                let max = 0;                
                
                data.forEach(n => {
                    heatData.push(Object.values(n))
                });
                const col = heatData[0].length //4
                const row = heatData.length //3

                var heatData1 = [];

                heatData1 = mathjs.transpose(heatData)
                //Finding maximum number
                heatData.forEach(d => {
                    const temp = Math.max(...d);
                    if (temp > max) {
                        max = temp;
                    }
                })
                
                //New Code starts
                var tree = clusterfck.hcluster(heatData1, clusterfck.EUCLIDEAN_DISTANCE,clusterfck.AVERAGE_LINKAGE);
                var tree1 = JSON.stringify(tree)        
                const tree_result_newick = tree1.replace(/"left":/g, '').replace(/"right":/g, '').replace(/{"value":/g, '').replace(/ /g,'').replace(/[\[\]']+/g,'').replace(/,"size":\d+/g, "").replace(/"/g, '').replace(/{/g,'(').replace(/}/g,')').replaceAll(/\),/g, ',').slice(0, -1)
                const tree_result = parseNewick(tree_result_newick)
                const tree_result_newick1 = tree_result_newick.replace(/[\(\)']+/g,'')

                //Convert 2d array to 1d array
                var arr = tree_result_newick1.split(',').map(Number)

                var heatData2 = []
                var heatData3 = []
  
                while(arr.length) heatData2.push(arr.splice(0,heatData1[0].length));

                heatData3 = mathjs.transpose(heatData2)
                let leavesLength = 0;

                const sortTree = (d) => {
                    if (d.children) {
                        d.children.forEach(c => {
                            sortTree(c);
                        });
                    } else {
                        leavesLength += 1;
                    }
                }

                sortTree(tree_result);
                // console.log(tree_result_newick)
                function getLeafNode(object, list) {
                    if (object.children) {
                        for (var i = 0; i < object.children.length; i++) {
                            getLeafNode(object.children[i], list);
                        }
                    }
                    else list.push(object.name);
                }
                
                var leafNodelist = []
                getLeafNode(tree_result, leafNodelist)

                var arr2d = [];
                var num = 0;
                function getLeafNode_bfs(data, level) {
                    if(arr2d[level] == undefined) arr2d[level] = [];
                    if (num !== 0 && data.name !== '') arr2d[level].push(data.name);
                    num++;
                    if (data.children) {
                        for(var index = 0; index < data.children.length; index++) {
                            getLeafNode_bfs(data.children[index], level+1);
                        }
                    }
                }

                getLeafNode_bfs(tree_result, 0);

                var arr1d = [].concat(...arr2d);

                this.data.sub_cluster_num = 4;
                var xline_list = []
                for (var index = 0; index < this.data.sub_cluster_num - 1; index++) {
                    const num = arr1d[index]
                    const row = leafNodelist.indexOf(num);
                    xline_list.push(row)
                }
                // console.log(arr1d)
                console.log(xline_list)
                this.data.leavesLength = leavesLength;
                return {heatData3, max, tree_result, leavesLength, xline_list}
            }, 
        },         
    },

        setup() {
            registerEditorConfig(editorConfig(this));
            this.defineGradient("bg", "vertical", [startColor, endColor]);
            const chartWidth = (this.size.width - 100) * 0.8;
            const chartHeight = (this.size.height - 100) * 0.05;
            const legendWidth = (this.size.width - 100) * 0.02;
            this.data.chartWidth = chartWidth;
            this.data.chartHeight = chartHeight;
            this.data.legendWidth = legendWidth;
        },
    });

    return visualizer;
}

        export function registerclustermap(){
            register(MODULE_NAME, init);
        }

register(MODULE_NAME, init)