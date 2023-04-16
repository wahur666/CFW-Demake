import { range } from "../../helpers/utils";
import { useState } from "preact/compat";

export enum Race {
    TERRAN = "Terran",
    MANTIS = "Mantis",
    CELAREONS = "Celareons",
}

export default function PlayerControl() {
    const [status, setStatus] = useState<string>("open");

    const onChange = (e) => {
        setStatus(e.target.value);
    };

    return (
        <div className="flex">
            <select
                name="status"
                id="status"
                className={"m-1"}
                value={status}
                onChange={onChange}
                style={{
                    width: "auto",
                    height: 42,
                }}
            >
                <option value="open" selected={true}>
                    Open
                </option>
                <option value="closed">Closed</option>
                <option value="easy">Easy - AI</option>
                <option value="medium">Medium - AI</option>
                <option value="hard">Hard - AI</option>
                <option value="nightmare">Nightmare - AI</option>
            </select>
            <div className={"flex flex-1"}>
                {status !== "closed" && (
                    <>
                        <input type="text" className={"m-1"} disabled value={"Imre"} />
                        <select name="color" id="color" className={"m-1"}>
                            {range(8).map((x) => (
                                <option value={x + 1}>{x + 1}</option>
                            ))}
                        </select>
                        <select name="race" id="race" className={"m-1"}>
                            {Object.values(Race).map((x, i) => (
                                <option value={x.toLowerCase()} selected={i === 0}>
                                    {x}
                                </option>
                            ))}
                        </select>
                        <select name="team" id="team" className={"m-1"}>
                            <option value={0} selected>
                                ..
                            </option>
                            {range(4).map((x) => (
                                <option value={x + 1}>{x + 1}</option>
                            ))}
                        </select>
                        <input type="text" disabled className={"m-1"} />
                    </>
                )}
            </div>
        </div>
    );
}
