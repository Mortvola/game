class BindGroups {
  private bindGroupLayout0: GPUBindGroupLayout | null = null;

  private bindGroupLayout1: GPUBindGroupLayout | null = null;

  private bindGroupLayout2: GPUBindGroupLayout | null = null;

  private bindGroupLayout2A: GPUBindGroupLayout | null = null;

  private bindGroupLayout3: GPUBindGroupLayout | null = null;

  getBindGroupLayout0(device: GPUDevice) {
    if (this.bindGroupLayout0) {
      return this.bindGroupLayout0;
    }

    this.bindGroupLayout0 = device.createBindGroupLayout({
      label: 'group0',
      entries: [
        { // Projection matrix
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // View matrix
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Camera position
          binding: 2,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Camera position
          binding: 3,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Light data
          binding: 4,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "read-only-storage",
          },
        },
      ]
    })

    return this.bindGroupLayout0;
  }

  getBindGroupLayout1(device: GPUDevice) {
    if (this.bindGroupLayout1) {
      return this.bindGroupLayout1;
    }

    this.bindGroupLayout1 = device.createBindGroupLayout({
      label: 'group1',
      entries: [
        { // Model matrix
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ]
    });

    return this.bindGroupLayout1;
  }

  getBindGroupLayout2(device: GPUDevice) {
    if (this.bindGroupLayout2) {
      return this.bindGroupLayout2;
    }

    this.bindGroupLayout2 = device.createBindGroupLayout({
      label: 'group2',
      entries: [
        { // Color
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
        { // Sampler
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
        { // Texture 2D
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
      ]
    });

    return this.bindGroupLayout2;
  }

  getBindGroupLayout2A(device: GPUDevice) {
    if (this.bindGroupLayout2A) {
      return this.bindGroupLayout2A;
    }

    this.bindGroupLayout2A = device.createBindGroupLayout({
      label: 'group2A',
      entries: [
        { // Color
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ]
    });

    return this.bindGroupLayout2A;
  }

  getBindGroupLayout3(device: GPUDevice) {
    if (this.bindGroupLayout3) {
      return this.bindGroupLayout3;
    }

    this.bindGroupLayout3 = device.createBindGroupLayout({
      label: 'group3',
      entries: [
        { // Circle data, reticle radius
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {},
        },
      ]
    });

    return this.bindGroupLayout3;
  }

}

export const bindGroups = new BindGroups();

export default BindGroups;