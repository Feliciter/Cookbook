import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { EditRecipeComponent } from './components/edit-recipe/edit-recipe.component';
import { RecipeListComponent  } from './components/recipe-list/recipe-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'recipe-list' },
  { path: 'add-recipe', component: AddRecipeComponent },
  { path: 'edit-recipe/:id', component: EditRecipeComponent  },
  { path: 'recipe-list', component: RecipeListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
