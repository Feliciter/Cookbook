import { Recipe } from "./../../shared/recipe";
import { ApiService } from "./../../shared/api.service";
import { Component, ViewChild, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"],
})
export class RecipeListComponent implements OnInit {
  RecipeData: any = [];

  dataSource: MatTableDataSource<Recipe>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    "recipe_name",
    "recipe_description",
   
  ];

  constructor(private recipeApi: ApiService) {}

  ngOnInit() {
    this.recipeApi.GetRecipes().subscribe((data) => {
      this.RecipeData = data;
      this.dataSource = new MatTableDataSource<Recipe>(this.RecipeData);

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  deleteRecipe(index: number, e) {
    if (window.confirm("Are you sure")) {
      const data = this.dataSource.data;
      data.splice(
        this.paginator.pageIndex * this.paginator.pageSize + index,
        1
      );
      this.dataSource.data = data;
      this.recipeApi.DeleteRecipe(e._id).subscribe();
    }
  }
}
