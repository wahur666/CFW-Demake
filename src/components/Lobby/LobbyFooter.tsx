import {Button, Text} from "@arwes/core";
import {route} from "preact-router";
import {PageRoutes} from "../../pages/routes";


export default function LobbyFooter() {
    const goToRoot = (event) => route(PageRoutes.ROOT);
    return <div className="flex justify-end footer">
        <Button className="w-40" animator={{ animate: true }} >
            <Text>Start</Text>
        </Button>
        <Button className="w-40" animator={{ animate: true }} onClick={goToRoot}>
            <Text>Cancel</Text>
        </Button>
    </div>
}
