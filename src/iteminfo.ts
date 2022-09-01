export class ItemInfo {
    name: string
    description: string

    thumbnailPath: string
    imagePath: string
    imageSize: number;
    imageKind: string;

    sensitive: boolean

    toJson() {
        return {
            "key1": "value1",
            "key2": "value2",
        }
    }
}