import { ApplicationConfig } from "@angular/core";
import { provideRouter, Routes } from "@angular/router";
import { HomeComponent } from "./features/home-component/home-component.component";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes)]
};

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent }
];