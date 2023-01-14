import {Button, Text} from "@arwes/core";


export default function LobbyFooter() {
    return <div className="flex justify-end footer">
        <Button className="w-40" animator={{ animate: true }} >
            <Text>Start</Text>
        </Button>
        <Button className="w-40" animator={{ animate: true }} >
            <Text>Cancel</Text>
        </Button>
    </div>
}
