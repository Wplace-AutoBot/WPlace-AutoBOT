// Parse input JSON
let e = await t.text();
let s = JSON.parse(e);

let { imageData: l } = s;
let { pixels: r } = l;

// Count total non-transparent pixels
let a = 0;
for (let i = 3; i < r.length; i += 4) {
    if (r[i] > 0) a++;
}

let c = Math.floor(a / o);
let x = [];

// Split the work into "o" parts
for (let part = 0; part < o; part++) {
    // Deep clone the original object
    let tClone = JSON.parse(JSON.stringify(s));
    let lClone = [...r];

    let i = 0;
    for (let idx = 3; idx < lClone.length; idx += 4) {
        if (r[idx] > 0) {
            let inThisPart = (
                part === 0
                    ? i < c
                    : part === o - 1
                        ? i >= part * c
                        : i >= part * c && i < (part + 1) * c
            );

            if (!inThisPart) {
                lClone[idx] = 0;
            }
            i++;
        }
    }

    // Replace pixels with modified clone
    tClone.imageData.pixels = lClone;

    // Count visible pixels for this part
    let d = 0;
    for (let idx = 3; idx < lClone.length; idx += 4) {
        if (lClone[idx] > 0) d++;
    }

    // Add state
    tClone.state = {
        totalPixels: d,
        paintedPixels: 0,
    };

    // Create downloadable JSON blob
    let blob = new Blob([JSON.stringify(tClone, null, 2)], {
        type: "application/json",
    });
    let url = URL.createObjectURL(blob);

    // Push info to results
    x.push({
        botNumber: part + 1,
        fileName: `wplace-bot-${part + 1}-progress.json`,
        visiblePixels: d,
        totalPixels: a,
        paintablePixels: d,
        downloadUrl: url,
    });
}
