import { defaultLayoutConf as conf} from "utils/editor";
import { EditorDef } from "utils/editor";

function run(v) {
    v.data._changed = true;
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
                            title: "Node Name",
                            type: "checkbox",
                            bind: {
                                object: conf,
                                path: "showNodeNames",
                                callback() {
                                    v.data.config.showNodeNames = conf.showNodeNames;
                                    run(v);
                                },
                            },
                        },
                    ]
                }
            }
        ],
    };
}
