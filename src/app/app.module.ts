import { HttpClientModule }   from '@angular/common/http';
import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { AppRoutingModule }   from './app-routing.module';
import { AppComponent }       from './app.component';
import { NotFoundComponent }  from './pages/not-found/not-found.component';
import { TitleCardComponent } from "./title-card/title-card.component";
import { DataCardComponent }  from './data-card/data-card.component';
import { PieChartComponent }  from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DetailComponent }    from "./pages/detail/detail.component";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
                ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TitleCardComponent,
    DataCardComponent,
    PieChartComponent,
    LineChartComponent,
    DetailComponent
],
  providers   : [],
  bootstrap   : [AppComponent],
})
export class AppModule {}
