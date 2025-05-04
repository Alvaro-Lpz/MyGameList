<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Top Juegos</title>
</head>
<body>

    <h1>Top Juegos</h1>

    @if(count($games) > 0)
        <ul>
            @foreach($games as $game)
                <li>
                    <strong>{{ $game['name'] }}</strong><br>
                    @if(isset($game['rating']))
                        <p>Rating: {{ $game['rating'] }}</p>
                    @endif
                    @if(isset($game['first_release_date']))
                        <p>Fecha de lanzamiento: {{ \Carbon\Carbon::createFromTimestamp($game['first_release_date'])->toDateString() }}</p>
                    @endif
                </li>
            @endforeach
        </ul>
    @else
        <p>No se encontraron juegos.</p>
    @endif

</body>
</html>