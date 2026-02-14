const fs = require("fs");

try {
  const html = fs.readFileSync("debug_olx.html", "utf8");
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/,
  );

  if (match && match[1]) {
    const data = JSON.parse(match[1]);
    console.log("Found __NEXT_DATA__");

    // Explore structure
    const props = data.props?.pageProps;
    if (props) {
      if (props.ads) {
        console.log("Found props.ads! Count:", props.ads.length);
        console.log("Sample Ad:", JSON.stringify(props.ads[0], null, 2));
      } else {
        console.log("No props.ads found", Object.keys(props));
      }
    } else {
      console.log("No pageProps found");
    }
  } else {
    console.log("No __NEXT_DATA__ script found");
  }
} catch (e) {
  console.error(e);
}
