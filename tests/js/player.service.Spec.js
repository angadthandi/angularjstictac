"use strict";

describe("player service", function () {
    var PlayerService, httpBackend, GameService;

    beforeEach(module("TicTacApp"));

    beforeEach(inject(function (_PlayerService_, $httpBackend, _GameService_) {
        PlayerService = _PlayerService_;
        httpBackend = $httpBackend;
        GameService = _GameService_;
    }));

    it("get color by player", function () {
        var result = PlayerService.GetColorByPlayer(1);
        expect(result).toBe("#0000FF");
    });

});