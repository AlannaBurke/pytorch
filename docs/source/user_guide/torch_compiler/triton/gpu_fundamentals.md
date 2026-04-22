(triton_gpu_fundamentals)=

# GPU Fundamentals for Triton Kernel Programming

## Introduction

This page provides an introduction to Triton as a language and compiler for
programming GPU kernels, along with the GPU architecture fundamentals that are
most relevant to writing efficient Triton code. Triton offers direct control
over GPU memory hierarchies, enabling developers to write highly performant
kernels by bridging the gap between GPU hardware and algorithm design.

## What is Triton?

Triton is both a programming language designed specifically for writing GPU
kernels and a compiler that translates Triton code into efficient GPU machine
instructions. Triton provides a higher-level, Pythonic interface that abstracts
away many of the low-level details of GPU programming (such as explicit
thread/block management and manual shared memory allocation) while still
allowing users to optimize data movement and computation. Triton kernels
operate on global GPU memory (HBM), and the language/compiler are designed to
generate efficient memory access patterns. While Triton does not expose
explicit control over shared memory (SRAM) in the same way as CUDA, it enables
users to write custom GPU kernels that can approach the performance of
hand-written CUDA code, making it easier to optimize for modern deep learning
workloads.

## GPU Architecture Fundamentals Relevant to Triton

A modern GPU is composed of several key components:

- **Streaming Multiprocessors (SMs):** The core compute units of the GPU where
  actual processing happens. For example, the NVIDIA A100 GPU has 108 SMs.
- **Global Memory (HBM):** A large memory pool (such as 40 GB or 80 GB) where
  data and models reside when moved to the GPU, for example via PyTorch's
  `.cuda()` method.
- **Shared Memory (SRAM):** Fast, on-chip memory shared by all threads within
  an SM, and used for efficient data sharing and computation.

Triton kernels execute on the SMs, giving you direct control over shared memory
and compute cores, whereas PyTorch primarily operates on global memory.

## Key Takeaways on GPU Programming with Triton

- Triton operates on-chip, controlling SMs and shared memory directly, while
  PyTorch primarily operates on global memory.
- The **memory bandwidth bottleneck** is the primary performance limiter on
  GPUs, not compute FLOPS.
- Triton enables intelligent data movement and kernel design to hide latency
  and maximize throughput.

## See Also

- {ref}`triton_intro`
- {ref}`triton_vs_cuda`
- [Triton language documentation](https://triton-lang.org/)
