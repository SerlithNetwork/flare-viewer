
export default function () {
    let event: EventSource | null = null;

    function listen<T>(
        url: string,
        options: {
            onMessage: (message: MessageEvent<T>) => void,
            onTermination: () => void,
        }
    ) {

        event = new EventSource(url)
        event.onmessage = (message: MessageEvent<T>) => {
            options.onMessage(message)
        }
        event.addEventListener("flare$terminated", () => {
            event?.close()
            event = null
            options.onTermination()
        })

    }

    onBeforeUnmount(() => {
        event?.close()
        event = null
    })

    return {
        listen,
    }
}
