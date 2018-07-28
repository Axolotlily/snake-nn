class NeuralNet {
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  

    //constructor
    constructor(inputs, hiddenNo, outputNo) {

        //set dimensions from parameters
        this.iNodes = inputs; //No. of input nodes
        this.oNodes = outputNo; //No. of hidden nodes
        this.hNodes = hiddenNo; //No. of output nodes


        //create first layer weights 
        //included bias weight
        this.whi = new Matrix(this.hNodes, this.iNodes + 1); //matrix containing weights between the input nodes and the hidden nodes

        //create second layer weights
        //include bias weight
        this.whh = new Matrix(this.hNodes, this.hNodes + 1); //matrix containing weights between the hidden nodes and the second layer hidden nodes

        //create second layer weights
        //include bias weight
        this.woh = new Matrix(this.oNodes, this.hNodes + 1); //matrix containing weights between the second hidden layer nodes and the output nodes 

        //set the matricies to random values
        this.whi.randomize();
        this.whh.randomize();
        this.woh.randomize();
        // console.log(this.whi);
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  

    //mutation function for genetic algorithm
    mutate(mr) {
        //mutates each weight matrix
        this.whi.mutate(mr);
        this.whh.mutate(mr);
        this.woh.mutate(mr);
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //calculate the output values by feeding forward through the neural network
    output(inputsArr) {

        //convert array to matrix
        //Note woh has nothing to do with it its just a function in the Matrix class
        var inputs = this.woh.singleColumnMatrixFromArray(inputsArr);

        //add bias 
        var inputsBias = inputs.addBias();


        //-----------------------calculate the guessed output

        //apply layer one weights to the inputs
        var hiddenInputs = this.whi.dot(inputsBias);
        //pass through activation function(sigmoid)
        var hiddenOutputs = hiddenInputs.activate();

        //add bias
        var hiddenOutputsBias = hiddenOutputs.addBias();

        //apply layer two weights
        var hiddenInputs2 = this.whh.dot(hiddenOutputsBias);
        var hiddenOutputs2 = hiddenInputs2.activate();
        var hiddenOutputsBias2 = hiddenOutputs2.addBias();

        //apply level three weights
        var outputInputs = this.woh.dot(hiddenOutputsBias2);
        //pass through activation function(sigmoid)
        var outputs = outputInputs.activate();

        //convert to an array and return
        return outputs.toArray();
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //crossover function for genetic algorithm
    crossover(partner) {

        //creates a new child with layer matrices from both parents
        var child = new NeuralNet(this.iNodes, this.hNodes, this.oNodes);
        child.whi = this.whi.crossover(partner.whi);
        child.whh = this.whh.crossover(partner.whh);
        child.woh = this.woh.crossover(partner.woh);
        return child;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //return a neural net which is a clone of this Neural net
    clone() {
        var clone = new NeuralNet(this.iNodes, this.hNodes, this.oNodes);
        clone.whi = this.whi.clone();
        clone.whh = this.whh.clone();
        clone.woh = this.woh.clone();

        return clone;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //converts the weights matrices to a single table 
    //used for storing the snakes brain in a file
    
    NetToTable() {

        //create table
        var t = new Table();


        //convert the matricies to an array 
        var whiArr = this.whi.toArray();
        var whhArr = this.whh.toArray();
        var wohArr = this.woh.toArray();

        //set the amount of columns in the table
        for (var i = 0; i < max(whiArr.length, whhArr.length, wohArr.length); i++) {
            t.addColumn();
        }

        //set the first row as whi
        var tr = t.addRow();

        for (var i = 0; i < whiArr.length; i++) {
            tr.setFloat(i, whiArr[i]);
        }


        //set the second row as whh
        tr = t.addRow();

        for (var i = 0; i < whhArr.length; i++) {
            tr.setFloat(i, whhArr[i]);
        }

        //set the third row as woh
        tr = t.addRow();

        for (var i = 0; i < wohArr.length; i++) {
            tr.setFloat(i, wohArr[i]);
        }

        //return table
        return t;
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //takes in table as parameter and overwrites the matrices data for this neural network
    //used to load snakes from file
    TableToNet(t) {

        //create arrays to tempurarily store the data for each matrix
        var whiArr = new float[this.whi.rows * this.whi.cols];
        var whhArr = new float[this.whh.rows * this.whh.cols];
        var wohArr = new float[this.woh.rows * this.woh.cols];

        //set the whi array as the first row of the table
        var tr = t.getRow(0);

        for (var i = 0; i < whiArr.length; i++) {
            whiArr[i] = tr.getFloat(i);
        }


        //set the whh array as the second row of the table
        tr = t.getRow(1);

        for (var i = 0; i < whhArr.length; i++) {
            whhArr[i] = tr.getFloat(i);
        }

        //set the woh array as the third row of the table

        tr = t.getRow(2);

        for (var i = 0; i < wohArr.length; i++) {
            wohArr[i] = tr.getFloat(i);
        }


        //convert the arrays to matrices and set them as the layer matrices 
        this.whi.fromArray(whiArr);
        this.whh.fromArray(whhArr);
        this.woh.fromArray(wohArr);
    }

    NetForSave(){        
        //create arrays to tempurarily store the data for each matrix
        console.log(this.whi);
        var whiArr = this.whi.toArray();
        var whhArr = this.whh.toArray();
        var wohArr = this.woh.toArray();

        return `{"whi":[${whiArr}],"whh":[${whhArr}],"woh":[${wohArr}]}`;
    }

    LoadForNet(whiArr, whhArr, wohArr){         
        this.whi.fromArray(whiArr);
        this.whh.fromArray(whhArr);
        this.woh.fromArray(wohArr);
    }
}