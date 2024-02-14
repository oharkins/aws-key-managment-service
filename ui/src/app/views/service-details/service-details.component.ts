import { Component } from '@angular/core';
import { ForgeModule } from "@tylertech/forge-angular";
import { NgForOf } from "@angular/common";

interface IFeedbackData {
  title: string;
  from: string;
  date: string;
  type: string;
  details: string;
}

const data: IFeedbackData[] = [
  {
    title: 'Great presentation',
    from: 'Employee name',
    date: '00/00/2020',
    type: 'Praise',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
  },
  {
    title: 'Excellent group communication',
    from: 'Employee name',
    date: '00/00/2020',
    type: 'Praise',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
  },
  {
    title: 'Teamwork!',
    from: 'Employee name',
    date: '00/00/2020',
    type: 'Praise',
    details: 'Lorem ipsum dolor sit amet, consectetur adipiscing'
  }
];

@Component({
  selector: 'app-toolbar-example',
  templateUrl: './service-details.component.html',
  standalone: true,
  imports: [
    ForgeModule,
    NgForOf
  ],
  styleUrls: ['./service-details.component.scss']
})

export class ServiceDetailsComponent {
  public feedbackData = data;
}
