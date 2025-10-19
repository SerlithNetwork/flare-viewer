
export default defineEventHandler((event) => {
    const { id, token } = event.context.params!;
    // TODO: Remove the placeholder and forward to Jet
    return {
        id,
        token,
    }
})
