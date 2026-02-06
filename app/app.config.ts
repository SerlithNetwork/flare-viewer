
export default defineAppConfig({
    title: 'Flare',
    description: "Airplane CPU and Memory profiler",
    image: "img/logo.png",
    color: "#FD81B7",

    repository: "https://github.com/SerlithNetwork/flare-viewer",
    discord: "https://discord.serlith.net",
    blog: "https://blog.biquaternions.me",

    flare: "https://github.com/SerlithNetwork/FlarePlatform",

    holder: "Serlith Network",
    url: "https://flare.serlith.net/",

    ui: {
        colors: {
            primary: "pink"
        },
        main: {
            base: 'min-h-[calc(90vh-var(--ui-header-height))]'
        },
    },
})
