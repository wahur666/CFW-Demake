import {range} from "../helpers/utils";


export enum Race {
    TERRAN = "Terran",
    MANTIS = "Mantis",
    CELAREONS = "Celareons"
}

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
            {range(8).map(x =>
                <option value={x + 1}>{x + 1}</option>
            )}
        </select>
        <select name="race" id="race" className={"m-1"}>
            {Object.values(Race).map((x, i) =>
                <option value={x.toLowerCase()} selected={i === 0}>{x}</option>
            )}
        </select>
        <select name="team" id="team" className={"m-1"}>
            <option value=".." selected>..</option>
            {range(4).map(x =>
                <option value={x}>{x}</option>
            )}
        </select>
        <input type="text" disabled className={"m-1"}/>
    </div>

}
