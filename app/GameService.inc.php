<?php

require_once(__DIR__ . "/GameModel.inc.php");


class HttpRequest
{
    const GET = 'GET';
    const POST = 'POST';
    const PUT = 'PUT';
    const DELETE = 'DELETE';

    /// HTTP verb in use (GET|POST|PUT|DELETE)
    public $verb = false;

    /// Parameters passed in. Query params or parsed json/xml.
    public $parameters = false;
}


class GameService
{
    protected $m_model = false;

    // Constructor
    public function __construct()
    {
        $this->m_model = new GameModel();
    }


    public function create($request)
    {
        return $this->update($request);
    }


    public function read($request)
    {
        return [
			'message' => 'Hello World (Read)',
			'selectedValues' => $this->m_model->getSelections(),
			'unSelectedValues' => $this->m_model->getUnSelected(),
			'nextTurn' => $this->m_model->nextTurn()
		];
    }


    public function update($request)
    {
        return [
            'row' => $request->parameters['row'],
            'col' => $request->parameters['col'],
            'color' => $request->parameters['color'],
            'set' => $this->m_model->set($request->parameters['row'], $request->parameters['col'], 1, $request->parameters['color'])
        ];
    }


    public function delete($request)
    {
        return [
			'set' => $this->m_model->clearDB(),
			'unSelectedValues' => $this->m_model->getUnSelected()
		];
    }
}


?>