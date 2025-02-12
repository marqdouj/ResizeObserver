using Microsoft.JSInterop;

namespace DJM.ResizeObserver
{
    public class HtmlResizeObserver
    {
        private readonly Lazy<Task<IJSObjectReference>> moduleTask;
        private readonly DotNetObjectReference<HtmlResizeObserver>? dotNetRef;

        public HtmlResizeObserver(IJSRuntime jsRuntime)
        {
            moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
                "import", "./_content/DJM.ResizeObserver/ts/js/htmlResizeObserver.js").AsTask());
            dotNetRef = DotNetObjectReference.Create(this);
        }

        public async ValueTask Observe(string id)
        {
            var module = await moduleTask.Value;
            await module.InvokeAsync<string>("observe", id, dotNetRef);
        }

        public async ValueTask UnObserve(string id)
        {
            var module = await moduleTask.Value;
            await module.InvokeAsync<string>("unobserve", id);
        }

        public event Action<OnResizeArgs>? OnResize;

        [JSInvokable]
        public void OnResized(string id, double height, double width)
        {
            OnResize?.Invoke(new OnResizeArgs(id, height, width));
        }

        public async ValueTask DisposeAsync()
        {
            dotNetRef?.Dispose();

            if (moduleTask.IsValueCreated)
            {
                var module = await moduleTask.Value;
                await module.DisposeAsync();
            }
        }
    }
}
