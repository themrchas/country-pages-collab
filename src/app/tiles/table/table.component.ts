import { Input, Component, OnInit } from '@angular/core';
import { SpListService } from '../../services/sp-list.service';

import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input()
  settings: any;
  listItems: Array<any>;

  parsedListItems: Observable<Array<any>>;

  formatDate(strDate:string): void {

    console.log('passed date', strDate,'converted date',moment(strDate).format('MM/DD/YYYY'));
  }

  

  constructor(private spListService: SpListService) { }

  ngOnInit() {
    this.listItems = Array<any>();
    this.spListService.getListItems(this.settings.source.webURL, this.settings.source.listName,
      this.settings.source.order, this.settings.source.filter, this.settings.source.rowLimit).subscribe({
      next: response => {
        console.log('SampleList in table.components.ts is', response);

        //Loop over raw resultsn
        for (const result of response['d'].results) {

       //   result.columns = [];
       result.columns = {};
          console.log('processing result with value',result);
          for (const column of this.settings.columns) {
          //  console.log('pushing', column.columnName,'with value',result[column.columnName]);
          //  result.columns.push(result[column.columnName]);
          
          //  result.columns[column.columnName] = result[column.columnName]
          result.columns[column.columnName] = (column.columnName != 'Created') ? result[column.columnName] : 
                                                                    moment(result[column.columnName]).format('MM/DD/YYYY');
            
          }
          this.listItems.push(result.columns);
          this.formatDate(result['Created']);

          console.log('listItems is',this.listItems);

          this.parsedListItems = of(this.listItems);
        }
      }
    });
  }

}
