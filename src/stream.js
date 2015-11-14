(function() {

  var temp = new THREE.Vector3();

  var Stream = THREE.Stream = function() {

    this.leaders = [];

    var geometry = new THREE.Geometry();

    for (var i = 0; i < 1000; i++) {

      var v = new THREE.Vector3();
      geometry.vertices.push(v);

      if (!(i % 2)) {
        this.leaders.push(v);
      }

    }

    var material = new THREE.LineBasicMaterial({
      color: 'white',
      linewidth: 2
    });

    THREE.LineSegments.call(this, geometry, material);

  };

  Stream.prototype = Object.create(THREE.LineSegments.prototype);

  Stream.prototype.drag = 0.33;

  Stream.prototype.update = function() {

    for (var i = 0; i < this.leaders.length; i++) {

      var j = i * 2;
      var lead = this.leaders[i];
      var next = this.geometry.vertices[j + 1];

      temp.copy(lead);

      next
        .add(
          temp.sub(next).multiplyScalar(this.drag)
        );

    }

    this.geometry.verticesNeedUpdate = true;

    return this;

  };

})();