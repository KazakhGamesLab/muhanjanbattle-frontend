import { images } from "../../constants/preloadImages";

export class Tile {
    constructor(x, y, img_url, name, type) {
        this.x = x;
        this.y = y;
        this.img_url = img_url;
        this.name = name;
        this.type = type;

        this.image = images[name];

        this.loaded = true;
        this.width = this.image.width;
        this.height = this.image.height;
    }

    draw(ctx) {
        if (!this.loaded) return;

        ctx.drawImage(
            this.image,
            this.x - this.width / 2,  
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            img_url: this.img_url,
            name: this.name,
            type: this.type,
        };
    }

    static fromJSON(data) {
        return new Tile(
            data.x,
            data.y,
            data.img_url,
            data.name,
            data.type
        );
    }
}