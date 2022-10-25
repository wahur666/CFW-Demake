import EditorComponent from "./EditorComponent";


export default function EditorArea() {
    return <EditorComponent>
        <textarea cols={30} rows={5} type="text" name="textbox" id="out" />
    </EditorComponent>

}
