(triton_resources)=

# Triton Resources

Here are some additional resources for strengthening your Triton skills.

## Official Documentation

- [Triton language documentation](https://triton-lang.org/)
- [Triton GitHub repository](https://github.com/triton-lang/triton)

## Visualization and Profiling

### Triton-Viz

Triton-Viz is a visualization and profiling toolkit designed to make GPU
programming with Triton more intuitive and accessible. It provides real-time
visualizations of tensor operations and memory usage, helping developers debug,
analyze performance, and better understand how their Triton code interacts with
accelerator hardware. Notably, Triton-Viz can be used without a GPU, allowing
users to explore and optimize Triton programs on any system.

- [GitHub - Deep-Learning-Profiling-Tools/triton-viz](https://github.com/Deep-Learning-Profiling-Tools/triton-viz)

## Interactive Learning

### Triton Puzzles

Triton Puzzles is an interactive, hands-on resource designed to teach Triton
programming from first principles. Through a series of progressively
challenging puzzles, you will learn key concepts such as memory loading,
storage, and efficient GPU programming — starting with simple tasks and
advancing to real-world algorithms like Flash Attention and quantized neural
networks. The puzzles run in a Triton interpreter, so you can experiment and
learn without needing a GPU.

- [GitHub - srush/Triton-Puzzles](https://github.com/srush/Triton-Puzzles)

## PyTorch Integration

- [Using User-Defined Triton Kernels with torch.compile](https://pytorch.org/tutorials/recipes/torch_compile_user_defined_triton_kernel_tutorial.html) (PyTorch Tutorial)
- [`torch.library.triton_op`](https://pytorch.org/docs/stable/library.html) API reference

## See Also

- {ref}`triton_intro`
- {ref}`triton_vs_cuda`
- {ref}`triton_gpu_fundamentals`
