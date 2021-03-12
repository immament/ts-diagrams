function svgInit() {
  SVGSVGElement.prototype.createSVGMatrix = () => {
    return {
      translate: function () {
        return this;
      },
      multiply: function () {
        return this;
      },
      scale: function () {
        return this;
      },
    } as DOMMatrix;
  };

  SVGSVGElement.prototype.createSVGTransform = () => {
    return new SVGTransformImpl() as SVGTransform;
  };

  SVGSVGElement.prototype.createSVGPoint = () => {
    return {
      matrixTransform: function () {
        return this;
      },
    } as DOMPoint;
  };
}

class SVGTransformImpl implements Partial<SVGTransform> {
  matrix: DOMMatrix = SVGSVGElement.prototype.createSVGMatrix();
  setMatrix(matrix: DOMMatrix): void {
    this.matrix = matrix;
  }
  setRotate(angle: number, cx: number, cy: number): void {}
  setScale(sx: number, sy: number): void {}
  setSkewX(angle: number): void {}
  setSkewY(angle: number): void {}
  setTranslate(tx: number, ty: number): void {}
}

export default svgInit;
