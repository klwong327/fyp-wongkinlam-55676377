import { defaultLayoutConf as conf} from "utils/editor";
import { EditorDef } from "utils/editor";

function run(v) {
    v.data._changed = true;
    v.run();
}

function update(v) {
    v.forceRedraw = true;
    v.run();
}
export const editorRef = {} as any;

export function editorConfig(v): EditorDef {
    return {
        sections: [
            {
                id: "settings",
                title: "Settings",
                layout: "single-page",
                view: {
                    type: "list",
                    items: [
                        {
                            title: "Sub Cluster Number",
                            type: "input",
                            format: "int",
                            value: {
                                current: v.data.sub_cluster_num,
                                callback(x) {
                                    v.data.sub_cluster_num = x;
                                    update(v);
                                },
                            },
                        },
                    ]
                }
            }
        ],
    };
}
