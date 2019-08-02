"use strict";

describe("game service", function () {
    var GameService, httpBackend, UniqueArrayFilter;

    beforeEach(module("TicTacApp"));

    beforeEach(inject(function (_GameService_, $httpBackend, _UniqueArrayFilter_) {
        GameService = _GameService_;
        httpBackend = $httpBackend;
        UniqueArrayFilter = _UniqueArrayFilter_;
    }));

    it("calculate winner", function () {
        GameService.CalcWinner(1, '00,01,02');
        expect(GameService.gameboardLocked).toBe(true);
    });

});