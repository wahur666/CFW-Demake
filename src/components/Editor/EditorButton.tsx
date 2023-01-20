import EditorComponent from "./EditorComponent";


export default function EditorButton(props: {name: string, cb: () => void}) {
    return  <EditorComponent>
        <button
            className="bg-amber-500 rounded p-2 hover:bg-amber-400"
            style={{
                width: "150px",
            }}
            onClick={props.cb}
        >
            {props.name}
        </button>
    </EditorComponent>
}
