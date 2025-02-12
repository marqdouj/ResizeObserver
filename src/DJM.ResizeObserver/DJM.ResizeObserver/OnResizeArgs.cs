namespace DJM.ResizeObserver
{
    public class OnResizeArgs(string id, double height, double width)
    {
        public string Id { get; } = id;
        public double Height { get; } = height;
        public double Width { get; } = width;
    }
}
