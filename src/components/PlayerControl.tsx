export default function PlayerControl() {

    return <div className="flex">
        <select name="status" id="status" className={"m-1"}>
            <option value="open" selected={true}>Open</option>
            <option value="closed">Closed</option>
            <option value="easy">Easy - AI</option>
            <option value="medium">Medium - AI</option>
            <option value="hard">Hard - AI</option>
            <option value="nightmare">Nightmare - AI</option>
        </select>
        <input type="text" className={"m-1"} disabled value={"Imre"}/>
        <select name="color" id="color" className={"m-1"}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
        </select>
        <select name="race" id="race" className={"m-1"}>
            <option value="terran" selected={true}>Terran</option>
            <option value="mantis">Mantis</option>
            <option value="Celareon">Celareon</option>
        </select>
        <select name="team" id="team" className={"m-1"}>
            <option value=".." selected>..</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </select>
        <input type="text" disabled className={"m-1"}/>
    </div>

}