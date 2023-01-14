import {FrameHexagon, Text} from "@arwes/core";
import {range} from "../helpers/utils";

export enum BattleMap {
    RANDOM = "Random",
    RANDOM_RING = "Random Ring",
    RANDOM_STAR = "Random Star",
    PURE_RANDOM = "Pure Random"
}


export enum StartingResource {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High"
}

export enum GameType {
    KILL_UNITS = "Kill Units",
    DESTROY_HQS = "Destroy HQs",
    KILL_PLATS_FABS = "Kill Plats, Fabs"
}

export enum MapSize {
    SMALL = "Small",
    MEDIUM = "Medium",
    LARGE = "Large"
}

export enum Terrain {
    LIGHT = "Light",
    MEDIUM = "Medium",
    HEAVY = "Heavy"
}

export enum Visibility {
    NORMAL = "Normal",
    EXPLORED = "Explored",
    ALL_VISIBLE = "All visible"
}

export enum StartingBase {
    MINIMAL = "Minimal",
    STANDARD = "Standard",
    ADVANCED = "Advanced"
}


export default function LobbySettings() {

    return <FrameHexagon className={"settings"}>
        <div className={"flex flex-col"}>
            <div className={"flex justify-between"}>
                <Text className={"m-0 flex-important flex-col justify-center"}>
                    Battle Map
                </Text>
                <select name="battle-map" id="battle-map" style={{
                    width: 150,
                    height: 35
                }}>
                    {Object.values(BattleMap).map(e =>
                        <option value={e.toLowerCase()}>{e}</option>
                    )}
                </select>
            </div>

            <div className={"flex justify-between"}>
                <Text className={"m-0 flex-important flex-col justify-center"}>
                    Starting resource
                </Text>
                <select name="battle-map" id="battle-map" style={{
                    width: 150,
                    height: 35
                }}>
                    {Object.values(StartingResource).map(x =>
                        <option value={x.toLowerCase()}>{x}</option>
                    )}
                </select>
            </div>
            <div className={"flex justify-between"}>
                <Text className={"m-0 flex-important flex-col justify-center"}>
                    Number of Systems
                </Text>
                <select name="battle-map" id="battle-map" style={{
                    width: 150,
                    height: 35
                }}>
                    { range(16).map(x =>
                        <option value={x + 1}>{x + 1}</option>
                    )}
                </select>
            </div>
            <div className={"flex justify-between"}>
                <Text className={"m-0 flex-important flex-col justify-center"}>
                    Map Size
                </Text>
                <select name="battle-map" id="battle-map" style={{
                    width: 150,
                    height: 35
                }}>
                    {Object.values(MapSize).map(x =>
                        <option value={x.toLowerCase()}>{x}</option>
                    )}
                </select>
            </div>
            <div className={"flex justify-between"}>
                <Text className={"m-0 flex-important flex-col justify-center"}>
                    Terrain
                </Text>
                <select name="battle-map" id="battle-map" style={{
                    width: 150,
                    height: 35
                }}>
                    {Object.values(Terrain).map(x =>
                        <option value={x.toLowerCase()}>{x}</option>
                    )}
                </select>
            </div>
            <div className={"flex justify-between"}>
                <Text className={"m-0 flex-important flex-col justify-center"}>
                    Visibility
                </Text>
                <select name="battle-map" id="battle-map" style={{
                    width: 150,
                    height: 35
                }}>
                    {Object.values(Visibility).map(x =>
                        <option value={x.toLowerCase()}>{x}</option>
                    )}
                </select>
            </div>
            <div className={"flex justify-between"}>
                <Text className={"m-0 flex-important flex-col justify-center"}>
                    Starting Base
                </Text>
                <select name="battle-map" id="battle-map" style={{
                    width: 150,
                    height: 35
                }}>
                    {Object.values(StartingBase).map(x =>
                        <option value={x.toLowerCase()}>{x}</option>
                    )}
                </select>
            </div>
        </div>
    </FrameHexagon>

}
