import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Sortable from 'sortablejs';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {

  readonly stageIds = ['stage-0', 'stage-1', 'stage-2', 'stage-3'];
  readonly stages = [
    {
      id: 0,
      name: 'Backlog'
    },
    {
      id: 1,
      name: 'In Development'
    },
    {
      id: 2,
      name: 'Testing'
    },
    {
      id: 3,
      name: 'Completed'
    }
  ];

  readonly tasks = [
    [{ name: 'test' }, { name: 'dawdadaw' }, { name: 'dawdadaw' }, { name: 'dawdadaw' }, { name: 'dawdadaw' }, { name: 'dawdadaw' }],
    [{ name: 'dddd' }, { name: 'dddd' }, { name: 'dddd' }],
    [{ name: 'dawdaw' }],
    []
  ];

  ngOnInit(): void {
    setTimeout(() => {
      for (let stage of this.stages) {
        let element = document.getElementById(`stage-${stage.id}`);
        Sortable.create(element, {
          group: 'tasks',
          animation: 300,
          swapThreshold: 0.1,
          easing: 'cubic-bezier(1, 0, 0, 1)',
          onEnd: (event) => {
            console.log(event);
          },
          ghostClass: 'ghost',
          dragClass: 'dragged'
        });
      }
    }, 1);
  }

}
