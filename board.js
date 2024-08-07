export default class Board{

    static getTasks(columnId){
        const data = read().find(col => {
            return col.columnId == columnId;
        });
        
        return data.tasks;
    }

    static addTask(columnId, content){
        const data = read();
        const column = data.find(col => {
            return col.columnId == columnId;
        });
        const task = {
            taskId: Math.floor(Math.random() * 1000),
            content: content
        };

        column.tasks.push(task);
        //console.log(data);
        save(data);

        return task;
    }

    static updTask(taskId, updInfo){
        const data = read();

        function findColTask(){
            for(const column of data){
                const task = column.tasks.find(item => {
                    return item.taskId == taskId;
                });
    
                if(task){
                    return [task, column];
                }
            }
        }
        const [task, curCol] = findColTask();

        const targetCol = data.find(column => {
            return column.columnId == updInfo.columnId;
        });

        task.content = updInfo.content;
        curCol.tasks.splice(curCol.tasks.indexOf(task), 1);
        targetCol.tasks.push(task);

        save(data);
    }

    static delTask(taskId){
        const data = read();

        for(const column of data){
            const task = column.tasks.find(item => {
                return item.taskId == taskId;
            });

            if(task){
                column.tasks.splice(column.tasks.indexOf(task), 1);
            }            
        }

        save(data);
    }

    static getAllTasks(){
        const data = read();
        colCount();
        return [data[0].tasks, data[1].tasks, data[2].tasks];
    }
}

function read(){
    const data = localStorage.getItem("data");

    if(!data){
        return [
            {columnId: 0, tasks: []}, 
            {columnId: 1, tasks: []}, 
            {columnId: 2, tasks: []}
        ];
    }

    return JSON.parse(data);
}

function save(data){
    localStorage.setItem("data", JSON.stringify(data));
    colCount();
}

function colCount(){
    const data = read();

    const pending = document.querySelector("span.pending");
    pending.textContent = data[0].tasks.length;

    const progress = document.querySelector("span.progress");
    progress.textContent = data[1].tasks.length;

    const completed = document.querySelector("span.completed");
    completed.textContent = data[2].tasks.length;
}
