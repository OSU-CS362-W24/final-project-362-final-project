const sortPoints = require('./sortPoints')

test('sortPoints correctly sorts a normal set of ordered points', function(){
    const testArray = [{x:2,y:3},{x:1,y:4},{x:5,y:2},{x:4,y:4}]
    const expectedArray = [{x:1,y:4},{x:2,y:3},{x:4,y:4},{x:5,y:2}]
    const sortedArray = sortPoints(testArray)

    expect(sortedArray).toEqual(expectedArray)

})

test('sortPoints correctly sorts a set of ordered points including a 0 x', function(){
    const testArray = [{x:2,y:3},{x:0,y:10},{x:1,y:4},{x:5,y:2},{x:4,y:4}]
    const expectedArray = [{x:0,y:10},{x:1,y:4},{x:2,y:3},{x:4,y:4},{x:5,y:2}]
    const sortedArray = sortPoints(testArray)

    expect(sortedArray).toEqual(expectedArray)

})

test('sortPoints correctly sorts a set of ordered points including negative xs', function(){
    const testArray = [{x:2,y:3},{x:-15,y:10},{x:1,y:4},{x:5,y:2},{x:4,y:4}]
    const expectedArray = [{x:-15,y:10},{x:1,y:4},{x:2,y:3},{x:4,y:4},{x:5,y:2}]
    const sortedArray = sortPoints(testArray)

    expect(sortedArray).toEqual(expectedArray)

})

test('sortPoints correctly sorts a set of ordered points including multiple of the same xs', function(){
    const testArray = [{x:2,y:3},{x:5,y:9},{x:5,y:1},{x:1,y:4},{x:5,y:2},{x:4,y:4}]
    const expectedArray = [{x:1,y:4},{x:2,y:3},{x:4,y:4},{x:5,y:9},{x:5,y:1},{x:5,y:2}]
    const sortedArray = sortPoints(testArray)

    expect(sortedArray).toEqual(expectedArray)

})

test('sortPoints correctly sorts a set of ordered points that are already sorted', function(){
    const testArray = [{x:1,y:4},{x:2,y:3},{x:4,y:4},{x:5,y:2}]
    const expectedArray = [{x:1,y:4},{x:2,y:3},{x:4,y:4},{x:5,y:2}]
    const sortedArray = sortPoints(testArray)

    expect(sortedArray).toEqual(expectedArray)

})