import { TestBed, inject } from "@angular/core/testing";

import { NgxCalculationService } from "./ngx-calculation.service";

describe("NgxCalculationService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxCalculationService]
    });
  });

  it("should be created", inject(
    [NgxCalculationService],
    (service: NgxCalculationService) => {
      expect(service).toBeTruthy();
    }
  ));
});
