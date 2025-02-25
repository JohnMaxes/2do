import { Component, OnInit } from '@angular/core';

import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'nz-test',
  imports: [NzDividerModule, NzTableModule],
  template: `
  <div style='width: 70vw; border: 2px solid black'>
    <nz-table #basicTable [nzData]="listOfData" [nzPageSize]="10" nzShowPagination="true">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        @for (data of basicTable.data; track data) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
            <td>
              <a>Action 一 {{ data.name }}</a>
              <nz-divider nzType="vertical"></nz-divider>
              <a>Delete</a>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  </div>
  `
})
export class TestComponent implements OnInit {
  listOfData: any;
  ngOnInit(): void {
    this.listOfData = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
      }
    ];
  }
}
